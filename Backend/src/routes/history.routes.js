import { Router } from 'express';
import { isAuthenticated } from '../middleware/auth.middleware.js';
import { getAllUserHistories, getHistoryById, deleteHistoryById } from '../controllers/history.controller.js';

const router = Router()
/**
 * @API GET api/v1/history
 * @description Get user history
 *@access Private 
 */
router.get('/', isAuthenticated, getAllUserHistories)

/**
 * @API GET api/v1/history/:id
 * @description Get user history by ID:
 *@access Private 
 */
router.get('/:id', isAuthenticated, getHistoryById)

/**
 * @API DELETE api/v1/history/:id
 * @description Delete user history by ID:
 *@access Private 
 */
router.delete('/:id', isAuthenticated, deleteHistoryById)

export default router ;