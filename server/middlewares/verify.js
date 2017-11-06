import jwt from 'jsonwebtoken';
import conf from '../conf';
import i18n from '../i18n';

const __ = i18n.__;

export default async (req, res, next) => {
    const token = req.headers['authorization'] || req.headers['x-access-token'] || req.query.token;

    if (!token) {
        return res.status(403).json({
            success: false,
            errorCode: 'AUTH_E4444',
            message: __('error.AUTH_E4444')
        });
    }

    try {
        req.payload = await jwt.verify(token, conf.server.secret);
        next();
    } catch (e) {
        switch (e.message) {
            case 'jwt expired':
                return res.status(403).json({
                    success: false,
                    errorCode: 'AUTH_E4443',
                    message: __('error.AUTH_E4443')
                });
            case 'invalid token':
                return res.status(403).json({
                    success: false,
                    errorCode: 'AUTH_E4445',
                    message: __('error.AUTH_E4445')
                });
            case 'invalid signature':
                return res.status(403).json({
                    success: false,
                    errorCode: 'AUTH_E4446',
                    message: __('error.AUTH_E4446')
                });
            case 'jwt malformed':
                return res.status(403).json({
                    success: false,
                    errorCode: 'AUTH_E4447',
                    message: __('error.AUTH_E4447')
                });
            default:
        }
        res.status(403).json({
            success: false,
            message: e.message
        });
    }
}