import getApi from './api';
import { conf, defineProperties, log, } from '../helpers';

const init = (appKey, version = '1.0') => {
    if (!new RegExp(/^[a-f\d]{24}$/).test(appKey)) {
        return log.error('Invalid application key');
    }
    defineProperties('appKey', appKey);
    const API = getApi(version);
    const api = new API();
    Object.keys(api).map(key => defineProperties(key, api[key]));
    return window[conf.globalObjectName];
};

export default () => {
    // window global 객체에 auth 객체 초기화
    Object.defineProperties(window, {
        [conf.globalObjectName]: {
            value: {},
            writable: false,
            enumerable: false,
            configurable: false,
        },
    });
    defineProperties('init', init);
};
