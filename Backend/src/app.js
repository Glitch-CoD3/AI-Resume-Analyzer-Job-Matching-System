import express from 'express'
import cookieParser from 'cookie-parser'
import cors from "cors";

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.static('public'));

import authRoutes from './routes/auth.routes.js'
app.use('/api/v1/auth', authRoutes)

//interview routes
import interviewRoutes from './routes/interview.routes.js'
app.use('/api/v1/reports', interviewRoutes)

//dashboard routes
import dashboardRoutes from './routes/dashboard.routes.js'
app.use('/api/v1/dashboard', dashboardRoutes)


//history routes
import historyRoutes from './routes/history.routes.js'
app.use('/api/v1/history', historyRoutes)

export default app;