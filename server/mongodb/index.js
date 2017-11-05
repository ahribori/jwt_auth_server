import mongoose from 'mongoose';
import logger from '../logger';
import conf from '../conf';

const MONGO_URI = conf.server.mongo_uri ? conf.server.mongo_uri  : 'mongodb://localhost:27017/jwt_auth';

mongoose.connect(MONGO_URI, {
	useMongoClient: true
});

mongoose.Promise = global.Promise;

mongoose.connection
	.on('connected', () => {
		logger.info(`Mongoose connected successful => ${MONGO_URI}`);
	})
	.on('error', err => {
		logger.error(err)
	});