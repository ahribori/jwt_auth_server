import express from 'express';
import jwt from 'jsonwebtoken';
import conf from '../../conf';
import Application from '../../mongodb/models/application';
import verifyTokenMiddleware from '../../middlewares/verify';

const router = express.Router();

router.post('/init', async (req, res) => {
    res.sendStatus(200);
});

export default router;
