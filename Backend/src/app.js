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


const allowedOrigins = (process.env.CLIENT_URI || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)
  .map((origin) => new URL(origin).origin);

if (process.env.NODE_ENV !== "production") {
  allowedOrigins.push("http://localhost:5173");
}

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error("CORS rejected origin:", origin);
    console.error("Allowed origins:", allowedOrigins);

    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));


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