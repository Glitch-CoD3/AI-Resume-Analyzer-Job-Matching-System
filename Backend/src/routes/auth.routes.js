import { Router } from 'express';
import { loginUser, userRegister, logOutUser, logOutAllDevices, refresh, verifyEmail, forgetPassword, resetPassword } from '../controllers/auth.controller.js';
import { isAuthenticated } from '../middleware/auth.middleware.js';

const router = Router()

/**
 * @API POST api/v1/auth/register
 * @description Register a new user
 *@access public 
 */
router.post('/register', userRegister)


/**
 * @API POST api/v1/auth/verify-email
 * @description Verify the user's email address by OTP
 *@access public 
 */

router.post('/verify-email', verifyEmail)

/**
 * @API POST api/v1/auth/login
 * @description Log in an existing user
 *@access public 
 */
router.post('/login', loginUser)

/**
 * @API POST api/v1/auth/logout
 * @description Log out the current user
 *@access public 
 */
router.post('/logout', isAuthenticated, logOutUser)

/**
 * @API POST api/v1/auth/logout-all
 * @description Log out the current user from all devices
 *@access public 
 */
router.post('/logout-all', isAuthenticated, logOutAllDevices)

/**
 * @API POST api/v1/auth/forget-password
 * @description Initiate the password reset process for a user
 *@access public 
 */

router.post('/forget-password', forgetPassword)


/**
 * @API POST api/v1/auth/reset-password
 * @description Reset the user's password
 *@access public 
 */
router.post('/reset-password', resetPassword)

/**
 * @API GET api/v1/auth/refresh
 * @description Refresh the access token using the refresh token
 *@access public 
 */
router.get('/refresh', isAuthenticated, refresh)


export default router;