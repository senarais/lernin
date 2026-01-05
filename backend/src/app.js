import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.routes.js'
import courseRoutes from './routes/course.routes.js'

const app = express()

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))

app.use(express.json())
app.use(cookieParser())

// routes
app.use('/api/auth', authRoutes)
app.use('/api/courses', courseRoutes)

export default app