import Application from '../mongodb/models/application';
import conf from '../conf';

const serverOrigin = conf.sdk.server_origin;

export default async (req, res, next) => {
    const requestOrigin = req.get('origin') || req.header('x-origin');
    const appKey = req.header('Authorization');
    try {
        if (!new RegExp(/^[a-f\d]{24}$/i).test(appKey)) {
            return res.sendStatus(400);
        }
        const app = await Application.findOne({ _id: appKey });
        if (!app) {
            return res.sendStatus(404);
        }
        if (requestOrigin !== app.origin || requestOrigin !== serverOrigin) {
            if (!new RegExp(/(localhost|127.0.0.1)/).test(requestOrigin)) {
                return res.sendStatus(403);
            }
        }
        req.payload = {
            app,
        };
        return next();
    } catch (e) {
        return res.sendStatus(500);
    }
};
