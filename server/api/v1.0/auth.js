import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import conf from '../../conf';
import log from '../../logger';
import User from '../../mongodb/models/user';
import i18n from '../../i18n';
import verifyTokenMiddleware from '../../middlewares/verify';
import { levelSystem } from '../../helpers';

const router = express.Router();
const __ = i18n.__;
const tokenConfig = conf.server ? conf.server.token : undefined;

/* =========================================
 POST /auth/login
 {
 username,
 password,
 }
 ============================================ */
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOneByUsername(username);
        if (!user) {
            return res.status(404).json({
                errorCode: 'AUTH_E0404',
                message: __('error.AUTH_E0404'),
            });
        }
        if (user.password !== crypto.createHmac('sha1', conf.server.secret).update(password).digest('base64')) {
            return res.status(403).json({
                errorCode: 'AUTH_E0403',
                message: __('error.AUTH_E0403'),
            });
        }
        const token = jwt.sign(
            {
                _id: user._id,
                username: user.username,
                nickname: user.nickname,
                admin: user.admin,
            },
            conf.server.secret,
            {
                expiresIn: tokenConfig.expiresIn || '1d',
                issuer: tokenConfig.issuer || 'jwt_auth_server',
                subject: 'user',
            },
        );
        const levelInfo = levelSystem.getLevelByExp(user.exp);
        user.level = levelInfo.level;
        user.last_login = new Date();
        user.save();
        return res.json(token);
    } catch (e) {
        log.error(e);
        res.sendStatus(500);
    }
});

/* =========================================
 POST /auth/verify
 {
 username,
 password,
 }
 ============================================ */
router.get('/verify', verifyTokenMiddleware);
router.get('/verify', async (req, res) => {
    res.json(req.payload);
});

export default router;
