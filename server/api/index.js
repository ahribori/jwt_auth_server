import express from 'express';
import cors from 'cors';
import user from './user';
import application from './application';
import auth from './auth';
import verifyTokenMiddleware from '../middlewares/verify';

const router = express.Router();

router.get('/', (req, res) => {
    res.json('API');
});

router.use('/', cors()); // CORS Middleware
router.use('/user', user);
router.use('/application', verifyTokenMiddleware); // JWT Token Check Middleware
router.use('/application', application);
router.use('/auth', auth);

export default router;