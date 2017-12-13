import getApi from './api';
import { conf, defineProperties } from '../helpers';

const init = (appKey, version = '1.0') => {
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
