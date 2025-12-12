import { Response } from 'express';
import { AuthRequest } from '../types';
import { Report } from '../models/Report';
import { Worker } from '../models/Worker';
import { User } from '../models/User';
import { EmergencyAlert } from '../models/EmergencyAlert';

export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalReports,
    pendingReports,
    completedReports,
    activeWorkers,
    totalUsers,
    recentReports,
    emergencyAlerts,
    weeklyReports,
  ] = await Promise.all([
    Report.countDocuments(),
    Report.countDocuments({ status: 'pending' }),
    Report.countDocuments({ status: 'completed' }),
    Worker.countDocuments({ status: { $in: ['available', 'busy'] } }),
    User.countDocuments(),
    Report.countDocuments({ createdAt: { $gte: weekAgo } }),
    EmergencyAlert.countDocuments({ status: 'active' }),
    Report.countDocuments({ createdAt: { $gte: weekAgo } }),
  ]);

  // Calculate completion rate
  const completionRate =
    totalReports > 0 ? Math.round((completedReports / totalReports) * 100) : 0;

  // Get reports by category
  const reportsByCategory = await Report.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);

  // Get reports by status
  const reportsByStatus = await Report.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  // Get reports trend (last 7 days)
  const reportsTrend = await Report.aggregate([
    { $match: { createdAt: { $gte: weekAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({
    success: true,
    data: {
      overview: {
        totalReports,
        pendingReports,
        completedReports,
        completionRate,
        activeWorkers,
        totalUsers,
        emergencyAlerts,
        weeklyReports,
      },
      charts: {
        reportsByCategory,
        reportsByStatus,
        reportsTrend,
      },
    },
  });
};

export const getReportAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  const { startDate, endDate } = req.query;

  const match: any = {};
  if (startDate) match.createdAt = { $gte: new Date(startDate as string) };
  if (endDate) match.createdAt = { ...match.createdAt, $lte: new Date(endDate as string) };

  const [avgCompletionTime, priorityDistribution, statusOverTime] = await Promise.all([
    // Average completion time
    Report.aggregate([
      { $match: { status: 'completed', completedAt: { $exists: true }, ...match } },
      {
        $project: {
          completionTime: {
            $subtract: ['$completedAt', '$createdAt'],
          },
        },
      },
      {
        $group: {
          _id: null,
          avgTime: { $avg: '$completionTime' },
        },
      },
    ]),

    // Priority distribution
    Report.aggregate([
      { $match: match },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]),

    // Status over time
    Report.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            status: '$status',
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.date': 1 } },
    ]),
  ]);

  const avgTimeHours = avgCompletionTime[0]
    ? Math.round(avgCompletionTime[0].avgTime / (1000 * 60 * 60))
    : 0;

  res.json({
    success: true,
    data: {
      avgCompletionTimeHours: avgTimeHours,
      priorityDistribution,
      statusOverTime,
    },
  });
};

export const getWorkerAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  const [topWorkers, workerDistribution, zoneStats] = await Promise.all([
    // Top performing workers
    Worker.find()
      .populate('userId', 'name email')
      .sort({ completedReports: -1, rating: -1 })
      .limit(10),

    // Worker status distribution
    Worker.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),

    // Reports by zone
    Worker.aggregate([
      { $group: { _id: '$zone', workers: { $sum: 1 } } },
      { $sort: { workers: -1 } },
    ]),
  ]);

  res.json({
    success: true,
    data: {
      topWorkers,
      workerDistribution,
      zoneStats,
    },
  });
};

export const getLocationHeatmap = async (req: AuthRequest, res: Response): Promise<void> => {
  const reports = await Report.find({
    status: { $in: ['pending', 'assigned', 'in_progress'] },
  }).select('location status priority');

  const heatmapData = reports.map((report) => ({
    coordinates: report.location.coordinates,
    address: report.location.address,
    status: report.status,
    priority: report.priority,
  }));

  res.json({
    success: true,
    data: { heatmapData },
  });
};
