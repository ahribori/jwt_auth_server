import axios from 'axios';
import conf from './conf';

export default (method = 'GET', path = '', data = {}) => new Promise((resolve, reject) => {
    axios({
        url: `${conf.serverOrigin}/api/v1.0/sdk${path}`,
        headers: {
            Authorization: window[conf.globalObjectName].appKey || '',
        },
        method,
        data,
    }).then((response) => {
        resolve(response);
    }).catch((error) => {
        reject(error.response);
    });
});
