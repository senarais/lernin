import express from 'express'
import { register, login, logout } from '../controller/auth.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)

router.get('/me', authMiddleware, (req, res) => {
    res.json({ data: req.user })
})

export default router;