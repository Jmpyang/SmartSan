import { Router } from 'express';
import { body } from 'express-validator';
import * as emergencyController from '../controllers/emergencyController';
import { authenticate, optionalAuth, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { asyncHandler } from '../utils/asyncHandler';
import { upload } from '../utils/upload';

const router = Router();

const createAlertValidation = [
  body('message').trim().notEmpty().withMessage('Message is required'),
  body('severity').optional().isIn(['medium', 'high', 'critical']),
];

router.post(
  '/',
  optionalAuth,
  upload.array('images', 3),
  validate(createAlertValidation),
  asyncHandler(emergencyController.createEmergencyAlert)
);

router.get('/', authenticate, asyncHandler(emergencyController.getEmergencyAlerts));
router.get('/nearby', authenticate, asyncHandler(emergencyController.getNearbyEmergencyAlerts));
router.get('/:id', authenticate, asyncHandler(emergencyController.getEmergencyAlertById));

router.patch(
  '/:id/resolve',
  authenticate,
  authorize('admin', 'worker'),
  asyncHandler(emergencyController.resolveEmergencyAlert)
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  asyncHandler(emergencyController.deleteEmergencyAlert)
);

export default router;
