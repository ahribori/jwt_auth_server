import express from 'express';
import path from 'path';
import fs from 'fs';
import conf from '../../conf';
import sdkVerifyMiddleware from '../../middlewares/sdk';

const router = express.Router();

router.use('/verify', sdkVerifyMiddleware);
router.post('/verify', async (req, res) => {
    res.sendStatus(200);
});

router.use('/application', sdkVerifyMiddleware);
router.get('/application', async (req, res) => {
    const { app } = req.payload;
    const projectedApp = {
        appKey: app._id,
        origin: app.origin,
        callback_url: app.callback_url,
    };
    res.json(projectedApp);
});

router.get('/createLoginButton', (req, res) => {
    const htmlPath = path.resolve('sdk/clb/clb.html');
    const { size } = req.query;
    const className = new RegExp(/^(xs|sm|md|lg|xl)$/).test(size) ? size : 'md';

    fs.readFile(htmlPath, 'utf8', (err, file) => {
        const clbJsUrl = `${conf.sdk.server_origin}/static/js/clb.js`;
        const loginButton = file
            .replace('{{{className}}}', `${className}`)
            .replace('{{{clbJS}}}', clbJsUrl);
        if (err) {
            return res.sendStatus(500);
        }
        return res.send(loginButton);
    });
});

export default router;
