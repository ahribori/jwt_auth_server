import { request, defineProperties, log, conf } from '../../../helpers';
import MessageHandler from './messageHandler';

export default class API {
    constructor() {
        log.info('API 1.0 Initialized');
        if (!window[conf.globalObjectName].messageHandler) {
            const messageHandler = new MessageHandler();
            defineProperties('messageHandler', messageHandler);
            log.info('API 1.0 Message handler bind');
        }
        return {
            getToken: this.getToken,
            setToken: this.setToken,
            assignLoginButton: this.assignLoginButton,
        };
    }

    assignLoginButton = async ({
        selector,
        success,
        fail,
        always,
        popup = true,
    }) => {
        await request('GET', '/verify');
        const element = document.querySelector(selector);
        if (!element) {
            return log.error(`셀렉터 ${selector} 와 일치하는 엘리먼트가 존재하지 않습니다`);
        }
        element.onclick = () => {
            const requestUrl = `${conf.serverOrigin}/login?` +
                `a=${btoa(window[conf.globalObjectName].appKey)}&` +
                `o=${encodeURIComponent(window.location.origin)}`;
            if (popup) {
                const popupWindow = window.open(
                    requestUrl, 'targetWindow',
                    'toolbar=no, location=no, status=no, menubar=no, scrollbars=no,' +
                    ' resizable=no, width=800, height=600',
                );
            } else {
                window.location.href = requestUrl;
            }
        };
        return null;
    };

    getToken = () => {
        console.log('getToken');
    };

    setToken = () => {
        console.log('setToken');
    };
}
