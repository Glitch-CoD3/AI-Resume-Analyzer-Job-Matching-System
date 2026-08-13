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
  'http://localhost:5173' // Optional: include your local dev server port (e.g. 3000 or 5173)
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      // or if origin is in the allowed origins array
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);



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