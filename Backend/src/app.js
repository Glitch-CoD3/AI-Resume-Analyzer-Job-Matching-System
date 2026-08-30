import express from 'express'
import cookieParser from 'cookie-parser'
import cors from "cors";

const app = express();
app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


const allowedOrigins = [
  'https://ai-frontend-eta-henna.vercel.app',
  'http://localhost:5173'
];
// const allowedOrigins = process.env.CLIENT_URI ? process.env.CLIENT_URI.split(',') : [];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// 1. Apply CORS middleware to all incoming requests
app.use(cors(corsOptions));

// 2. Handle preflight (OPTIONS) requests using the modern regex syntax
app.options(/(.*)/, cors(corsOptions));


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