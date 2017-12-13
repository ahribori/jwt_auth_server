import express from 'express';
import jwt from 'jsonwebtoken';
import conf from '../../conf';
import Application from '../../mongodb/models/application';
import verifyTokenMiddleware from '../../middlewares/verify';

const router = express.Router();

router.post('/init', async (req, res) => {
    const requestOrigin = req.get('origin');
    const appKey = req.header('Authorization');
    try {
        if (!new RegExp(/^[a-f\d]{24}$/i).test(appKey)) {
            return res.sendStatus(400);
        }
        const app = await Application.findOne({ _id: appKey });
        if (!app) {
            return res.sendStatus(404);
        }
        if (requestOrigin !== app.origin) {
            return res.sendStatus(403);
        }
        return res.sendStatus(200);
    } catch (e) {
        return res.sendStatus(500);
    }
});

export default router;
