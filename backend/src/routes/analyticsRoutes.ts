import { Router } from 'express';
import * as analyticsController from '../controllers/analyticsController';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/dashboard', authenticate, asyncHandler(analyticsController.getDashboardStats));
router.get('/reports', authenticate, asyncHandler(analyticsController.getReportAnalytics));
router.get('/workers', authenticate, asyncHandler(analyticsController.getWorkerAnalytics));
router.get('/heatmap', authenticate, asyncHandler(analyticsController.getLocationHeatmap));

export default router;
