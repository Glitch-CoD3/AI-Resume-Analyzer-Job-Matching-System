import express from 'express';
import { Router } from 'express';
import { InterviewReport } from '../models/interviewReport.models.js';
import { generateInterViewReportController } from '../controllers/interview.controller.js';
import { isAuthenticated } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';


const router = express.Router();

/**
 * @API POST api/v1/report-generate
 * @description generate new interview report on the basis of 
                user self descripcription, resume and job details
 *@access private 
 */

router.post('/', isAuthenticated, upload.single("resume"), generateInterViewReportController)

export default router;