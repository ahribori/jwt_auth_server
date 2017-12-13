import { request, log, conf } from '../../../helpers';

export default class API {
    constructor() {
        log.info('API 1.0 Initialized');
        return {
            getToken: this.getToken,
            setToken: this.setToken,
            assignLoginButton: this.assignLoginButton,
        };
    }

    assignLoginButton = ({
        selector, success, fail, always,
    }) => {
        const element = document.querySelector(selector);
        if (!element) {
            return log.error(`셀렉터 ${selector} 와 일치하는 엘리먼트가 존재하지 않습니다`);
        }
        element.onclick = () => {
            window.location.href =
                // `${conf.serverOrigin}/login?` +
                `http://localhost:3000/login?` +
                `a=${btoa(window[conf.globalObjectName].appKey)}&` +
                `o=${encodeURIComponent(window.location.origin)}`;
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
