import express from 'express';
import cors from 'cors';
import user from './user';
import application from './application';
import auth from './auth';
import sdk from './sdk';
import verifyTokenMiddleware from '../../middlewares/verify';
import sdkVerifyMiddleware from '../../middlewares/sdk';

const router = express.Router();

router.use('/', cors()); // CORS Middleware
router.use('/user', user);
router.use('/application', verifyTokenMiddleware); // JWT Token Check Middleware
router.use('/application', application);
router.use('/auth', auth);
router.use('/sdk', sdkVerifyMiddleware);
router.use('/sdk', sdk);

export default router;
