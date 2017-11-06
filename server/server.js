/* =========================================
 Load dependencies
 ============================================*/
import express from 'express';
import path from 'path';
import appPath from './path';
import fs from 'fs';
import figlet from 'figlet';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import conf from './conf';
import i18n from './i18n';
import api from './api';
import './mongodb';

require('dotenv').config();
/* =========================================
 Load Config.js
 ============================================*/
const port = conf.server.port || process.env.PORT || 8088;

/* =========================================
 Express Configuration
 ============================================*/
const app = express();

// parse JSON and url-encoded query
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(i18n.init);

// access log setting
const accessLogStream = fs.createWriteStream(path.join(appPath.LOG_PATH, 'access.log'), {flags: 'a'});
app.use(morgan('combined', {stream: accessLogStream}));
app.use(morgan('dev'));

app.use('/', express.static(path.resolve(__dirname, '../build')));

// set api router
app.use('/api', api);

app.use('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, '../build/index.html'));
});

// open the server
app.listen(port, () => {
    figlet('JWT Auth', (err, data) => {
        console.log(data);
        console.log(`Running on port ${port}...`);
    });
});