import express from 'express';
import logger from '../logger';
import User from '../mongodb/models/user';

const router = express.Router();

const field = {
	username: {
		regex: /^[a-z0-9_-]{4,18}$/,
		errorResponse: {
			field: 'username',
			message: 'username should be 4-18 character',
			errorCode: 'USER_E0001'
		}
	},
	password: {
		regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
		errorResponse: {
			field: 'password',
			message: 'password should be more stronger',
			errorCode: 'USER_E0002'
		}
	},
	nickname: {
		regex: /[a-zA-Z가-힣]{2,16}/,
		errorResponse: {
			field: 'nickname',
			message: 'nickname should be 2-16 character',
			errorCode: 'USER_E0003'
		}
	},
	email: {
		regex: /[a-z0-9]+[_a-z0-9\.-]*[a-z0-9]+@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})/,
		errorResponse: {
			field: 'email',
			message: 'email should be an email',
			errorCode: 'USER_E0004'
		}
	}
};

/* =========================================
 POST /user (Register User)
 {
 username,
 password,
 nickname
 }
 ============================================*/
router.post('/', async (req, res) => {
	try {
		const {username, password, nickname} = req.body;

		if (username === undefined ||
			username === null ||
			!field.username.regex.test(username)) {
			return res.status(400).json(field.username.errorResponse);
		}

		if (password === undefined ||
			password === null ||
			!field.password.regex.test(password)) {
			return res.status(400).json(field.password.errorResponse);
		}

		if (nickname === undefined ||
			nickname === null ||
			!field.nickname.regex.test(nickname)) {
			return res.status(400).json(field.nickname.errorResponse);
		}

		const user = await User.findOneByUsername(username);

		if (user) {
			return res.status(409).json({
				field: 'username',
				message: 'username already exist',
				errorCode: 'USER_E0409'
			});
		}

		const newUser = await User.create(username, password, nickname);

		const userCount = await User.count().exec();

		if (userCount === 1) await newUser.assignAdmin();

		res.json(newUser);

	} catch (e) {
		logger.error(e);
		res.status(500).json("Something broke!")
	}
});


/* =========================================
		 	GET /user/list
 ============================================*/
router.get('/list', async (req, res) => {
	if (!req.decoded || !req.decoded.admin) {
		return res.status(403).json({
			message: 'you are not an admin',
			errorCode: 'USER_E0403'
		});
	}
	try {
		const users = await User.find({});
		res.json(users);
	} catch (e) {
		logger.error(e);
		res.status(500).json("Something broke!")
	}

});

/* =========================================
 GET /user/:id
 ============================================*/
router.get('/:id', async (req, res) => {
	try {
		const id = req.params.id;
		const user = await User.findById(id, {
			nickname: true,
		});
		res.json(user);
	} catch (e) {
		logger.error(e);
		res.status(500).json("Something broke!")
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
 ============================================*/
router.put('/:id', async (req, res) => {
	try {
		const {
			nickname,
			email
		} = req.body;
		const updateObject = {};

		if (nickname !== null && nickname !== undefined) {
			if (!field.nickname.regex.test(nickname)) {
				return res.status(400).json(field.nickname.errorResponse);
			} else {
				updateObject.nickname = nickname;
			}
		}
		if (email !== null && email !== undefined) {
			if (!field.email.regex.test(email)) {
				return res.status(400).json(field.email.errorResponse);
			} else {
				updateObject.email = email;
			}
		}
		const updateResult = await User.update({ _id: req.params.id}, updateObject);
		res.json(updateResult);
	} catch (e) {
		logger.error(e);
		res.status(500).json("Something broke!")
	}
});

export default router;