import express from 'express'
import { register, login, logout, me, loginGoogle, googleAuthSuccess } from '../controller/auth.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.get('/me', authMiddleware, me)

// --- GOOGLE ROUTES ---
router.get('/google', loginGoogle)           // Step 1: Redirect ke Google
router.post('/google/success', googleAuthSuccess) // Step 2: Terima Token dari Frontend

export default router;