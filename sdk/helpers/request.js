import axios from 'axios';
import conf from './conf';
import log from './log';

export default (method = 'GET', path = '', data = {}) => new Promise((resolve, reject) => {
    axios({
        url: `${conf.serverOrigin}/api/v1.0/sdk${path}`,
        headers: {
            Authorization: window[conf.globalObjectName].appKey || '',
            'x-app-origin': window.location.origin,
        },
        method,
        data,
    }).then(response => resolve(response)).catch((error) => {
        const e = error.response;
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
        }
        return reject(error.response);
    });
});
