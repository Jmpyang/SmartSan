import { Response } from 'express';
import { AuthRequest } from '../types';
import { Worker } from '../models/Worker';
import { User } from '../models/User';
import { Report } from '../models/Report';
import { NotFoundError, AuthorizationError } from '../utils/errors';

export const getWorkers = async (req: AuthRequest, res: Response): Promise<void> => {
  const { status, zone, page = 1, limit = 20 } = req.query;

  const query: any = {};
  if (status) query.status = status;
  if (zone) query.zone = zone;

  const skip = (Number(page) - 1) * Number(limit);

  const [workers, total] = await Promise.all([
    Worker.find(query)
      .populate('userId', 'name email phone avatar')
      .populate('activeReports')
      .skip(skip)
      .limit(Number(limit))
      .sort({ rating: -1 }),
    Worker.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: {
      workers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    },
  });
};

export const getWorkerById = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const worker = await Worker.findOne({ userId: id })
    .populate('userId', 'name email phone avatar')
    .populate('activeReports');

  if (!worker) {
    throw new NotFoundError('Worker not found');
  }

  res.json({
    success: true,
    data: { worker },
  });
};

export const updateWorkerStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  // Workers can update their own status, admins can update any
  if (req.user?.role !== 'admin' && req.user?.userId !== id) {
    throw new AuthorizationError('Not authorized to update this worker');
  }

  const worker = await Worker.findOne({ userId: id });
  if (!worker) {
    throw new NotFoundError('Worker not found');
  }

  worker.status = status;
  await worker.save();

  res.json({
    success: true,
    message: 'Worker status updated',
    data: { worker },
  });
};

export const getWorkerStats = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const worker = await Worker.findOne({ userId: id });
  if (!worker) {
    throw new NotFoundError('Worker not found');
  }

  // Get completed reports for time-based stats
  const completedReports = await Report.find({
    assignedWorker: id,
    status: 'completed',
  }).sort({ completedAt: -1 });

  // Calculate average completion time
  let totalTime = 0;
  let validReports = 0;

  completedReports.forEach((report) => {
    if (report.completedAt && report.createdAt) {
      const time = report.completedAt.getTime() - report.createdAt.getTime();
      totalTime += time;
      validReports++;
    }
  });

  const avgCompletionTime = validReports > 0 ? totalTime / validReports : 0;
  const avgCompletionHours = Math.round(avgCompletionTime / (1000 * 60 * 60));

  res.json({
    success: true,
    data: {
      worker,
      stats: {
        completedReports: worker.completedReports,
        activeReports: worker.activeReports.length,
        rating: worker.rating,
        avgCompletionTime: avgCompletionHours,
        recentCompletions: completedReports.slice(0, 10),
      },
    },
  });
};

export const getMyWorkerProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AuthorizationError('Not authenticated');
  }

  const worker = await Worker.findOne({ userId: req.user.userId })
    .populate('userId', 'name email phone')
    .populate('activeReports');

  if (!worker) {
    throw new NotFoundError('Worker profile not found');
  }

  res.json({
    success: true,
    data: { worker },
  });
};
