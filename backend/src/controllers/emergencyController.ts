import { Response } from 'express';
import { AuthRequest } from '../types';
import { EmergencyAlert } from '../models/EmergencyAlert';
import { NotFoundError, AuthorizationError } from '../utils/errors';
import { compressImage, getFileUrl } from '../utils/upload';

export const createEmergencyAlert = async (req: AuthRequest, res: Response): Promise<void> => {
  const { message, location, severity } = req.body;

  // Parse location if it's a string
  const locationData = typeof location === 'string' ? JSON.parse(location) : location;

  // Handle uploaded images
  const images: string[] = [];
  if (req.files && Array.isArray(req.files)) {
    for (const file of req.files) {
      await compressImage(file.path);
      images.push(getFileUrl(req, file.filename, 'report'));
    }
  }

  const alert = await EmergencyAlert.create({
    message,
    location: locationData,
    severity: severity || 'high',
    images,
    userId: req.user?.userId,
  });

  res.status(201).json({
    success: true,
    message: 'Emergency alert created',
    data: { alert },
  });
};

export const getEmergencyAlerts = async (req: AuthRequest, res: Response): Promise<void> => {
  const { status, severity, page = 1, limit = 20 } = req.query;

  const query: any = {};
  if (status) query.status = status;
  if (severity) query.severity = severity;

  const skip = (Number(page) - 1) * Number(limit);

  const [alerts, total] = await Promise.all([
    EmergencyAlert.find(query)
      .populate('userId', 'name email phone')
      .sort({ severity: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    EmergencyAlert.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: {
      alerts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    },
  });
};

export const getEmergencyAlertById = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const alert = await EmergencyAlert.findById(id).populate('userId', 'name email phone');

  if (!alert) {
    throw new NotFoundError('Emergency alert not found');
  }

  res.json({
    success: true,
    data: { alert },
  });
};

export const resolveEmergencyAlert = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  // Only admins and workers can resolve alerts
  if (req.user?.role === 'citizen') {
    throw new AuthorizationError('Not authorized to resolve alerts');
  }

  const alert = await EmergencyAlert.findById(id);
  if (!alert) {
    throw new NotFoundError('Emergency alert not found');
  }

  alert.status = 'resolved';
  alert.resolvedAt = new Date();
  await alert.save();

  res.json({
    success: true,
    message: 'Emergency alert resolved',
    data: { alert },
  });
};

export const deleteEmergencyAlert = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  // Only admins can delete alerts
  if (req.user?.role !== 'admin') {
    throw new AuthorizationError('Only admins can delete alerts');
  }

  const alert = await EmergencyAlert.findById(id);
  if (!alert) {
    throw new NotFoundError('Emergency alert not found');
  }

  await EmergencyAlert.deleteOne({ _id: id });

  res.json({
    success: true,
    message: 'Emergency alert deleted',
  });
};

export const getNearbyEmergencyAlerts = async (req: AuthRequest, res: Response): Promise<void> => {
  const { longitude, latitude, maxDistance = 5000 } = req.query;

  if (!longitude || !latitude) {
    throw new NotFoundError('Longitude and latitude are required');
  }

  const alerts = await EmergencyAlert.find({
    status: 'active',
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [Number(longitude), Number(latitude)],
        },
        $maxDistance: Number(maxDistance),
      },
    },
  }).limit(20);

  res.json({
    success: true,
    data: { alerts },
  });
};
