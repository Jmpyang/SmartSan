import { Response } from 'express';
import { AuthRequest } from '../types';
import { Report } from '../models/Report';
import { Worker } from '../models/Worker';
import { NotFoundError, AuthorizationError } from '../utils/errors';
import { compressImage, getFileUrl } from '../utils/upload';
import path from 'path';

export const createReport = async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, description, category, location, priority, isAnonymous } = req.body;

  // Parse location if it's a string
  const locationData = typeof location === 'string' ? JSON.parse(location) : location;

  // Handle uploaded images
  const images: string[] = [];
  if (req.files && Array.isArray(req.files)) {
    for (const file of req.files) {
      // Compress image
      await compressImage(file.path);
      images.push(getFileUrl(req, file.filename, 'report'));
    }
  }

  // Create report
  const report = await Report.create({
    title,
    description,
    category,
    location: locationData,
    priority: priority || 'medium',
    images,
    userId: isAnonymous === 'true' || isAnonymous === true ? undefined : req.user?.userId,
    isAnonymous: isAnonymous === 'true' || isAnonymous === true,
  });

  res.status(201).json({
    success: true,
    message: 'Report created successfully',
    data: { report },
  });
};

export const getReports = async (req: AuthRequest, res: Response): Promise<void> => {
  const {
    status,
    priority,
    category,
    page = 1,
    limit = 20,
    sortBy = 'createdAt',
    order = 'desc',
  } = req.query;

  // Build query
  const query: any = {};
  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (category) query.category = category;

  // If user is a citizen, show only their reports (unless anonymous)
  if (req.user?.role === 'citizen') {
    query.$or = [{ userId: req.user.userId }, { isAnonymous: true }];
  }

  // Pagination
  const skip = (Number(page) - 1) * Number(limit);
  const sortOrder = order === 'asc' ? 1 : -1;

  const [reports, total] = await Promise.all([
    Report.find(query)
      .sort({ [sortBy as string]: sortOrder })
      .skip(skip)
      .limit(Number(limit))
      .populate('userId', 'name email')
      .populate('assignedWorker'),
    Report.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: {
      reports,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    },
  });
};

export const getReportById = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const report = await Report.findById(id)
    .populate('userId', 'name email phone')
    .populate('assignedWorker');

  if (!report) {
    throw new NotFoundError('Report not found');
  }

  // Check authorization (citizens can only see their own reports)
  if (req.user?.role === 'citizen' && report.userId !== req.user.userId && !report.isAnonymous) {
    throw new AuthorizationError('Not authorized to view this report');
  }

  res.json({
    success: true,
    data: { report },
  });
};

export const updateReport = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status, priority, assignedWorker } = req.body;

  const report = await Report.findById(id);
  if (!report) {
    throw new NotFoundError('Report not found');
  }

  // Only admins and workers can update reports
  if (req.user?.role === 'citizen') {
    throw new AuthorizationError('Not authorized to update reports');
  }

  // Update fields
  if (status) report.status = status;
  if (priority) report.priority = priority;
  if (assignedWorker) report.assignedWorker = assignedWorker;

  // Set completedAt when status changes to completed
  if (status === 'completed' && report.status !== 'completed') {
    report.completedAt = new Date();

    // Update worker stats
    if (report.assignedWorker) {
      const worker = await Worker.findOne({ userId: report.assignedWorker });
      if (worker) {
        worker.completedReports += 1;
        worker.activeReports = worker.activeReports.filter((r) => r !== id);
        await worker.save();
      }
    }
  }

  await report.save();

  res.json({
    success: true,
    message: 'Report updated successfully',
    data: { report },
  });
};

export const deleteReport = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const report = await Report.findById(id);
  if (!report) {
    throw new NotFoundError('Report not found');
  }

  // Only report creator or admin can delete
  if (req.user?.role !== 'admin' && report.userId !== req.user?.userId) {
    throw new AuthorizationError('Not authorized to delete this report');
  }

  await Report.deleteOne({ _id: id });

  res.json({
    success: true,
    message: 'Report deleted successfully',
  });
};

export const getNearbyReports = async (req: AuthRequest, res: Response): Promise<void> => {
  const { longitude, latitude, maxDistance = 5000 } = req.query; // maxDistance in meters

  if (!longitude || !latitude) {
    throw new NotFoundError('Longitude and latitude are required');
  }

  const reports = await Report.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [Number(longitude), Number(latitude)],
        },
        $maxDistance: Number(maxDistance),
      },
    },
  }).limit(50);

  res.json({
    success: true,
    data: { reports },
  });
};

export const getMyReports = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AuthorizationError('Not authenticated');
  }

  const reports = await Report.find({ userId: req.user.userId })
    .sort({ createdAt: -1 })
    .populate('assignedWorker');

  res.json({
    success: true,
    data: { reports },
  });
};

export const assignWorker = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { workerId } = req.body;

  // Only admins can assign workers
  if (req.user?.role !== 'admin') {
    throw new AuthorizationError('Only admins can assign workers');
  }

  const report = await Report.findById(id);
  if (!report) {
    throw new NotFoundError('Report not found');
  }

  const worker = await Worker.findOne({ userId: workerId });
  if (!worker) {
    throw new NotFoundError('Worker not found');
  }

  // Update report
  report.assignedWorker = workerId;
  report.status = 'assigned';
  await report.save();

  // Update worker
  worker.activeReports.push(id);
  worker.status = 'busy';
  await worker.save();

  res.json({
    success: true,
    message: 'Worker assigned successfully',
    data: { report },
  });
};

export const getRecommendedWorkers = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const report = await Report.findById(id);
  if (!report) {
    throw new NotFoundError('Report not found');
  }

  // Logic to find workers based on report location/context
  // For now, we match jurisdiction if it exists, or fall back to general available workers
  // In a real app, this would use geospatial queries or strict jurisdiction mapping

  // Mocking jurisdiction extraction from address or location
  // For this MVP, we will fetch workers who are 'available' and sort by their level proximity
  // If reports had a 'city' field, we would match jurisdiction=city

  const workers = await Worker.find({
    status: 'available',
    // In a real scenario, add: jurisdiction: report.city
  })
    .populate('userId', 'name email phone avatar')
    .limit(10);

  // Simple sorting: Prefer Local > State > National
  // This is a basic implementation.
  const sortedWorkers = workers.sort((a, b) => {
    const levels = { local: 1, state: 2, national: 3 };
    return (levels[a.level as keyof typeof levels] || 1) - (levels[b.level as keyof typeof levels] || 1);
  });

  res.json({
    success: true,
    data: { workers: sortedWorkers },
  });
};
