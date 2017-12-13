import Application from '../mongodb/models/application';

export default async (req, res, next) => {
    const requestOrigin = req.get('origin');
    const appKey = req.header('Authorization');
    try {
        if (!new RegExp(/^[a-f\d]{24}$/i).test(appKey)) {
            return res.sendStatus(400);
        }
        const app = await Application.findOne({ _id: appKey });
        if (!app) {
            return res.sendStatus(404);
        }
        if (requestOrigin !== app.origin) {
            return res.sendStatus(403);
        }
        return next();
    } catch (e) {
        return res.sendStatus(500);
    }
};
