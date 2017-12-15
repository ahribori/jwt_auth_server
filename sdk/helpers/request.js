import axios from 'axios';
import conf from './conf';
import log from './log';

export default ({
    method = 'GET',
    path = '',
    data = {},
    logging = true,
    authorization = window[conf.globalObjectName].appKey || '',
}) => new Promise((resolve, reject) => {
    axios({
        url: `${conf.serverOrigin}/api${path}`,
        headers: {
            Authorization: authorization,
            'x-app-origin': window.location.origin,
        },
        method,
        data,
    }).then(response => resolve(response)).catch((error) => {
        const e = error.response;
        const printError = () => {
            switch (e.status) {
                case 400:
                    return log.error('어플리케이션 키의 형식이 올바르지 않습니다');
                case 404:
                    return log.error('어플리케이션을 찾을 수 없습니다');
                case 403:
                    return log.error('등록된 어플리케이션 도메인의 요청이 아닙니다');
                case 500:
                    return log.error('알 수 없는 문제가 발생했습니다');
                default:
                    return null;
            }
        };
        if (logging) {
            printError();
        }
        return reject(e);
    });
});
