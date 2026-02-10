import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import * as liveClassController from '../controller/liveClass.controller.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/catalog', liveClassController.getCatalog); // List semua + status beli
router.get('/my-classes', liveClassController.getMyClasses); // List yg dimiliki
router.get('/:id', liveClassController.getClassDetail); // Detail + Link WA (Secure)

export default router;