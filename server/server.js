/* =========================================
 Load dependencies
 ============================================ */
import express from 'express';
import path from 'path';
import fs from 'fs';
import figlet from 'figlet';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import appPath from './path';
import conf from './conf';
import i18n from './i18n';
import api_v1_0 from './api/v1.0';
import './mongodb';

if (!conf.server.secret) {
    throw new Error('Secret key is not set. Check the _config.yml');
}
/* =========================================
 Load Config.js
 ============================================ */
require('dotenv').config();
/* =========================================
 Express Configuration
 ============================================ */
const app = express();
const port = conf.server.port || process.env.PORT || 8088;

// parse JSON and url-encoded query
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(i18n.init);

// access log setting
const accessLogStream = fs.createWriteStream(path.join(appPath.LOG_PATH, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));

const buildPath = path.resolve(__dirname, '../build');
app.use('/', express.static(buildPath));

app.use('/static/js/sdk.js', (req, res) => {
    const buildPathExist = fs.existsSync(buildPath);
    if (buildPathExist) {
        const assetManifest = require(`${buildPath}/asset-manifest.json`);
        const sdkPath = `${buildPath}/${assetManifest['sdk.js']}`;
        const sdkExist = fs.existsSync(sdkPath);
        if (!sdkExist) {
            return res.sendStatus(404);
        }
        return res.sendFile(sdkPath);
    }
    return res.sendStatus(404);
});

app.use('/static/js/clb.js', (req, res) => {
    const buildPathExist = fs.existsSync(buildPath);
    if (buildPathExist) {
        const assetManifest = require(`${buildPath}/asset-manifest.json`);
        const sdkPath = `${buildPath}/${assetManifest['clb.js']}`;
        const sdkExist = fs.existsSync(sdkPath);
        if (!sdkExist) {
            return res.sendStatus(404);
        }
        return res.sendFile(sdkPath);
    }
    return res.sendStatus(404);
});

// set api router
app.use('/api/v1.0', api_v1_0);

app.use('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../build/index.html'));
});

// open the server
app.listen(port, () => {
    figlet('JWT Auth', (err, data) => {
        console.log(data);
        console.log(`Running on port ${port}...`);
    });
});
