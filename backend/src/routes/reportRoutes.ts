import { Router } from 'express';
import { body } from 'express-validator';
import * as reportController from '../controllers/reportController';
import { authenticate, optionalAuth, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { asyncHandler } from '../utils/asyncHandler';
import { upload } from '../utils/upload';

const router = Router();

// Validation
const createReportValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').isIn(['garbage_overflow', 'broken_equipment', 'illegal_dumping', 'blocked_drain', 'other']),
];

// Routes
router.post(
  '/',
  optionalAuth,
  upload.array('images', 5),
  validate(createReportValidation),
  asyncHandler(reportController.createReport)
);

router.get('/', authenticate, asyncHandler(reportController.getReports));
router.get('/my-reports', authenticate, asyncHandler(reportController.getMyReports));
router.get('/nearby', authenticate, asyncHandler(reportController.getNearbyReports));
router.get('/:id', authenticate, asyncHandler(reportController.getReportById));

router.patch(
  '/:id',
  authenticate,
  authorize('admin', 'worker'),
  asyncHandler(reportController.updateReport)
);

router.delete('/:id', authenticate, asyncHandler(reportController.deleteReport));

router.post(
  '/:id/assign',
  authenticate,
  authorize('admin'),
  asyncHandler(reportController.assignWorker)
);

export default router;
