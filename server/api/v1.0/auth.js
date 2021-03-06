import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import conf from '../../conf';
import log from '../../logger';
import User from '../../mongodb/models/user';
import Message from '../../mongodb/models/message';
import i18n from '../../i18n';
import verifyTokenMiddleware from '../../middlewares/verify';
import { levelSystem } from '../../helpers';

const router = express.Router();
const __ = i18n.__;
const tokenConfig = conf.server ? conf.server.token : undefined;

const doThisIfAuthenticated = async (user) => {
    const newUser = user;
    const now = new Date();
    const levelInfo = levelSystem.getLevelByExp(newUser.exp);
    const diff = now - newUser.last_login;
    if (diff > 1000 * 60 * 60 * 24) {
        newUser.addExp('50');
        Message.sendSystemMessage('일일 로그인 경험치 50 획득', newUser._id);
    }
    newUser.level = levelInfo.level;
    newUser.last_login = now;
    const result = await newUser.save();
    return result;
};

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
        await doThisIfAuthenticated(user);
        return res.json(token);
    } catch (e) {
        log.error(e);
        res.sendStatus(500);
    }
});


/* =========================================
 POST /auth/social_login (oAuth save)
 {
 account_type
 social_id
 nickname
 thumbnail_image
 }
 ============================================ */
router.post('/social_login', async (req, res) => {
    const {
        account_type,
        social_id,
        nickname,
        profile_image,
    } = req.body;

    if (!new RegExp(/^(naver|kakao|facebook|google)$/).test(account_type)) {
        return res.status(400).json('account type must be one of naver, kakao, facebook, google');
    }
    if (!social_id || social_id === undefined || social_id === null) {
        return res.sendStatus(400);
    }
    if (!nickname || nickname === undefined || nickname === null) {
        return res.sendStatus(400);
    }

    try {
        let user = await User.findOne({ account_type, social_id });
        if (!user) {
            user = await new User({
                account_type,
                social_id,
                nickname,
                profile_image,
            }).save();
        }

        if (user.profile_image !== profile_image) {
            user.profile_image = profile_image;
        }

        const token = jwt.sign(
            {
                _id: user._id,
                account_type: user.account_type,
                social_id: user.social_id,
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
        await doThisIfAuthenticated(user);
        return res.json(token);
    } catch (e) {
        log.error(e);
        return res.sendStatus(500);
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

router.get('/refresh', verifyTokenMiddleware);
router.get('/refresh', async (req, res) => {
    // TODO 보안에 대한 고민 필요. verified token을 탈취당하면 계속 refresh 할수있음
    const { username, social_id, account_type } = req.payload;
    try {
        const user = await User.findOne({
            account_type,
            social_id,
            username,
        });
        if (user) {
            const token = jwt.sign(
                {
                    _id: user._id,
                    username: user.username,
                    nickname: user.nickname,
                    account_type,
                    social_id,
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
        }
        return res.sendStatus(404);
    } catch (e) {
        log.error(e);
        res.sendStatus(500);
    }
});

export default router;
