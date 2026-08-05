import { Router } from 'express';
import { isAuthenticated } from '../middleware/auth.middleware.js';
import { getUserHistory, getDashboardAnalytics, getDashboardDetails, updateUserAvatar } from '../controllers/dashboard.controller.js';
import { upload } from '../middleware/multer.middleware.js';
const router = Router()

router.put(
    "/avatar", isAuthenticated,
    upload.single("image"),
    updateUserAvatar
);
/**
 * @API GET api/v1/dashboard/history
 * @description Get user history
 *@access Private 
 */

router.get('/history', isAuthenticated, getUserHistory)
/**
 * @API GET api/v1/dashboard/analytics
 * @description Get dashboard analytics
 *@access Private 
 */


router.get('/analytics', isAuthenticated, getDashboardAnalytics)
/**
 * @API GET api/v1/dashboard/details
 * @description Get dashboard details
 *@access Private 
 */


router.get('/details', isAuthenticated, getDashboardDetails)

export default router;