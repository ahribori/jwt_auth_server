import getApi from './api';
import { conf, log, request, defineProperties } from '../helpers';

const init = async function init(appKey) {
    defineProperties('appKey', appKey);
    try {
        await request('POST', '/init');
        log.info(`${conf.globalObjectName} 객체가 초기화 되었습니다.`);

        // 초기화 이후
        const args = arguments;
        const version = (args[1] && typeof args[1] !== 'function') ?
            args[1] : '1.0';
        const API = getApi(version);
        const api = new API();
        Object.keys(api).map(key => defineProperties(key, api[key]));
        const callback = args[args.length - 1];
        if (typeof callback === 'function') {
            callback();
        }
    } catch (e) {
        switch (e.status) {
            case 400:
                return log.error('appKey의 형식이 올바르지 않습니다');
            case 404:
                return log.error(`appKey: ${appKey}에 해당하는 어플리케이션을 찾을 수 없습니다`);
            case 403:
                return log.error('등록된 어플리케이션 도메인의 요청이 아닙니다');
            case 500:
                return log.error('알 수 없는 문제가 발생했습니다');
            default:
        }
    }
    return null;
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
