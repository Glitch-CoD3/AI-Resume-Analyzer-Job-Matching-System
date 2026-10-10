import "./config/env.js";
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from "cors";
import morgan from 'morgan'

const app = express();
app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan("dev"));


const allowedOrigins = [
  "https://ai-frontend-eta-henna.vercel.app",
  "http://localhost:5173" // Explicitly add your local dev server
];

const corsOptions = {
  origin(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));


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