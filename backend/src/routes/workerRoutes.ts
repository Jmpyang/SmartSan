import { Router } from 'express';
import * as workerController from '../controllers/workerController';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', authenticate, asyncHandler(workerController.getWorkers));
router.get('/me', authenticate, authorize('worker'), asyncHandler(workerController.getMyWorkerProfile));
router.get('/:id', authenticate, asyncHandler(workerController.getWorkerById));
router.get('/:id/stats', authenticate, asyncHandler(workerController.getWorkerStats));
router.patch('/:id/status', authenticate, asyncHandler(workerController.updateWorkerStatus));

export default router;
