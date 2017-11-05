import express from 'express';
import cors from 'cors';
import user from './user';
import application from './application';
import auth from './auth';
const router = express.Router();

router.get('/', (req, res) => {
	res.json('API');
});

router.use('/', cors());
router.use('/user', user);
router.use('/application', application);
router.use('/auth', auth);

export default router;