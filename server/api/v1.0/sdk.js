import express from 'express';
import jwt from 'jsonwebtoken';
import conf from '../../conf';
import Application from '../../mongodb/models/application';
import verifyTokenMiddleware from '../../middlewares/verify';

const router = express.Router();

router.post('/init', async (req, res) => {
    res.sendStatus(200);
});

router.get('/application', async (req, res) => {
    const { app } = req.payload;
    const projectedApp = {
        appKey: app._id,
        origin: app.origin,
        callback_url: app.callback_url,
    };
    res.json(projectedApp);
});

export default router;
