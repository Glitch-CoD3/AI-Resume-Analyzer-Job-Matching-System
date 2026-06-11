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

// import { generateInterviewReport } from './services/ai.service.js';
// const report = await generateInterviewReport({
//   resume: " • Caching Strategies, CDN,  Role - Based Access Control(RBAC)6. DevOps: Basic Knowledge about Docker and theoretical knowledge about Kubernetes7. Problem solve: Code Forces, Code Chef, GeeksForGeeks, LeetCode8. Programming: C, C++, Python, Java, JavaScript9. Tools: Git, GitHub, Postman, Vs - code ",
//   selfdescribe: "I am a passionate developer who loves solving complex problems and building innovative solutions. I have a strong work ethic and am always eager to learn new technologies.",
//   jobdescribe: "We are looking for a skilled software engineer with expertise in full-stack development, particularly in JavaScript, React, and Node.js. The ideal candidate will have experience working on web applications and be able to collaborate effectively with our team."
// });

// console.log(report);

import authRoutes from './routes/auth.routes.js'
app.use('/api/v1/auth', authRoutes)

//interview routes
import interviewRoutes from './routes/interview.routes.js'
app.use('/api/v1/interviews', interviewRoutes)

export default app;