import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { getTryoutData } from '../controller/tryout.controller.js'

const router = express.Router()

router.get("/tryouts", getTryoutData)