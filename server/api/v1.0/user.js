import express from 'express';
import crypto from 'crypto';
import logger from '../../logger';
import User from '../../mongodb/models/user';
import conf from '../../conf';
import i18n from '../../i18n';
import verifyTokenMiddleware from '../../middlewares/verify';
import { levelSystem } from '../../helpers';

const router = express.Router();
const { __ } = i18n;

const { secret } = conf.server;

const field = {
    username: {
        regex: /^[a-z0-9_-]{4,18}$/,
        errorResponse: {
            field: 'username',
            message: __('error.USER_E0001'),
            errorCode: 'USER_E0001',
        },
    },
    password: {
        regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
        errorResponse: {
            field: 'password',
            message: __('error.USER_E0002'),
            errorCode: 'USER_E0002',
        },
    },
    nickname: {
        regex: /[a-zA-Z가-힣]{2,16}/,
        errorResponse: {
            field: 'nickname',
            message: __('error.USER_E0003'),
            errorCode: 'USER_E0003',
        },
    },
    email: {
        regex: /[a-z0-9]+[_a-z0-9\.-]*[a-z0-9]+@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})/,
        errorResponse: {
            field: 'email',
            message: __('error.USER_E0004'),
            errorCode: 'USER_E0004',
        },
    },
};

/* =========================================
 POST /user (Register User)
 {
 username, (require)
 password, (require)
 nickname, (require)
 email,
 }
 ============================================ */
router.post('/', async (req, res) => {
    try {
        const {
            username, password, nickname, email,
        } = req.body;

        if (username === '' || username === undefined ||
            username === null ||
            !field.username.regex.test(username)) {
            return res.status(400).json(field.username.errorResponse);
        }

        if (password === '' || password === undefined ||
            password === null ||
            !field.password.regex.test(password)) {
            return res.status(400).json(field.password.errorResponse);
        }

        if (nickname === '' || nickname === undefined ||
            nickname === null ||
            !field.nickname.regex.test(nickname)) {
            return res.status(400).json(field.nickname.errorResponse);
        }

        if (email !== '' && email !== undefined && email !== null) {
            if (!field.email.regex.test(email)) {
                return res.status(400).json(field.email.errorResponse);
            }
        }

        const user = await User.findOneByUsername(username);

        if (user) {
            return res.status(409).json({
                field: 'username',
                message: __('error.USER_E0401'),
                errorCode: 'USER_E0401',
            });
        }

        const newUser = await User.create(username, password, nickname, email);

        const userCount = await User.count().exec();

        if (userCount === 1) await newUser.assignAdmin();

        res.json(newUser);
    } catch (e) {
        logger.error(e);
        res.status(500).json('Something broke!');
    }
});


/* =========================================
 GET /user/list
 ============================================ */
router.get('/list', verifyTokenMiddleware); // JWT Token Check Middleware
router.get('/list', async (req, res) => {
    if (!req.payload || !req.payload.admin) {
        return res.status(403).json({
            message: __('error.USER_E0402'),
            errorCode: 'USER_E0402',
        });
    }
    try {
        const users = await User.find({});
        const usersWithLevelDetails = users.map(user => Object.assign({
            level_details: levelSystem.getLevelByExp(user.exp),
        }, user._doc));
        res.json(usersWithLevelDetails);
    } catch (e) {
        logger.error(e);
        res.status(500).json('Something broke!');
    }
});

/* =========================================
 GET /user/:id
 ============================================ */
router.get('/:id', verifyTokenMiddleware); // JWT Token Check Middleware
router.get('/:id', async (req, res) => {
    try {
        if ((req.payload._id === req.params.id) || req.payload.admin === true) {
            const { id } = req.params;
            const user = await User.findById(id, {
                account_type: true,
                username: true,
                nickname: true,
                email: true,
                email_verified: true,
                level: true,
                exp: true,
                cash: true,
                point: true,
                social_id: true,
                profile_image: true,
                admin: true,
                reg_date: true,
                last_login: true,
                blocked: true,
            });
            if (user) {
                const userResponse = Object.assign({}, user._doc);
                userResponse.level_details = levelSystem.getLevelByExp(user.exp);
                return res.json(userResponse);
            }
            return res.status(404).json({
                message: __('error.USER_E0404'),
                errorCode: 'USER_E0404',
            });
        }
        return res.status(403).json({
            errorCode: 'AUTH_E4300',
            message: __('error.AUTH_E4300'),
        });
    } catch (e) {
        logger.error(e);
        res.status(500).json('Something broke!');
    }
});

/* =========================================
 PUT /user/:id
  {
 nickname,
 email,
 blocked,
 admin,
 point,
 cash,
 level
 }
 ============================================ */
router.put('/:id', verifyTokenMiddleware); // JWT Token Check Middleware
router.put('/:id', async (req, res) => {
    try {
        const {
            nickname,
            password,
            email,
            cash,
            point,
            exp,
        } = req.body;
        const updateObject = {};

        if (nickname !== null && nickname !== undefined) {
            if (!field.nickname.regex.test(nickname)) {
                return res.status(400).json(field.nickname.errorResponse);
            }
            updateObject.nickname = nickname;
        }
        if (email !== null && email !== undefined) {
            if (!field.email.regex.test(email)) {
                return res.status(400).json(field.email.errorResponse);
            }
            updateObject.email = email;
        }
        const updateResult = await User.update({ _id: req.params.id }, updateObject);
        res.json(updateResult);
    } catch (e) {
        logger.error(e);
        res.status(500).json('Something broke!');
    }
});

/* =========================================
 PUT /user/changePassword/:username
  {
 prevPassword,
 newPassword
 }
 ============================================ */
router.put('/changePassword/:username', verifyTokenMiddleware);
router.put('/changePassword/:username', async (req, res) => {
    try {
        const { prevPassword, newPassword } = req.body;
        const user = await User.findOneByUsername(req.params.username);
        if (crypto.createHmac('sha1', secret).update(prevPassword).digest('base64') === user.password) {
            if (newPassword === undefined ||
                newPassword === null ||
                !field.password.regex.test(newPassword)) {
                return res.status(400).json(field.password.errorResponse);
            }
            const updateResult = await user.changePassword(newPassword);
            return res.json(updateResult);
        }
        return res.status(400).json({
            message: __('error.USER_E0444'),
            errorCode: 'USER_E0444',
        });
    } catch (e) {
        logger.error(e);
        res.status(500).json('Something broke!');
    }
});

export default router;
