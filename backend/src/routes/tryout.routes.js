import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import * as tryoutController from '../controller/tryout.controller.js';

const router = express.Router();

router.use(authMiddleware); // Semua wajib login

router.get('/list', tryoutController.listTryouts);
router.post('/start', tryoutController.startTryout);

// Flow Pengerjaan per Pelajaran
router.post('/section/start', tryoutController.startSection);
router.post('/section/:sectionSessionId/submit', tryoutController.submitSection);

// Submit total akhir
router.post('/:sessionId/finish', tryoutController.finishTryout);

export default router;