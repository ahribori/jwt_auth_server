import express from 'express';
import conf from '../conf';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../mongodb/models/user';
import i18n from '../i18n';
import verifyTokenMiddleware from '../middlewares/verify';

const router = express.Router();
const __ = i18n.__;

router.get('/', (req, res) => {
    console.log(req.payload)
    res.json('hi')
});

/* =========================================
 POST /auth/login
 {
 username,
 password,
 }
 ============================================*/
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOneByUsername(username);
    if (!user) {
        return res.status(404).json({
            errorCode: 'AUTH_E0404',
            message: __('error.AUTH_E0404')
        });
    } else {
        if (user.password !== crypto.createHmac('sha1', conf.server.secret).update(password).digest('base64')) {
            return res.status(403).json({
                errorCode: 'AUTH_E0403',
                message: __('error.AUTH_E0403')
            });
        } else {
            const token = jwt.sign({
                    _id: user._id,
                    username: user.username,
                    nickname: user.nickname,
                    admin: user.admin
                },
                conf.server.secret,
                {
                    expiresIn: '1d',
                    issuer: 'ahribori.com',
                    subject: 'user'
                });
            res.json(token);
        }
    }
});

/* =========================================
 POST /auth/verify
 {
 username,
 password,
 }
 ============================================*/
router.get('/verify', verifyTokenMiddleware);
router.get('/verify', async (req, res) => {
    res.json(req.payload);
});

export default router;