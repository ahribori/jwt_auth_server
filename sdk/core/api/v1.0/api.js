import cookie from 'browser-cookies';
import { request, defineProperties, log, conf } from '../../../helpers';
import MessageHandler from './messageHandler';

const messageHandler = new MessageHandler();

export default class API {
    constructor() {
        log.info('API 1.0 Initialized');
        return {
            getToken: this.getToken,
            setToken: this.setToken,
            assignLoginButton: this.assignLoginButton,
        };
    }

    assignLoginButton = async ({
        selector,
        target,
        success,
        fail,
        always,
        popup = true,
    }) => {
        await request('GET', '/verify');
        const _selector = selector || target;
        const element = document.querySelector(_selector);
        if (!element) {
            return log.error(`셀렉터 ${_selector} 와 일치하는 엘리먼트가 존재하지 않습니다`);
        }
        element.onclick = () => {
            const requestUrl = `${conf.serverOrigin}/login?` +
                `a=${btoa(window[conf.globalObjectName].appKey)}&` +
                `o=${encodeURIComponent(window.location.origin)}`;
            if (popup) {
                window.open(
                    requestUrl, 'targetWindow',
                    'toolbar=no, location=no, status=no, menubar=no, scrollbars=no, ' +
                    'resizable=no, width=800, height=600',
                );
            } else {
                window.location.href = requestUrl;
            }
        };
        if (typeof success === 'function') {
            messageHandler.setLoginSuccessCallback(success);
        }
        if (typeof fail === 'function') {
            messageHandler.setLoginFailCallback(fail);
        }
        if (typeof always === 'function') {
            messageHandler.setLoginAlwaysCallback(always);
        }
        return null;
    };

    getToken = () => {
        let token = null;
        if (window.localStorage) {
            token = window.localStorage.getItem(conf.tokenStorageName);
        }
        if (!token) {
            token = cookie.get(conf.tokenStorageName);
        }
        return token;
    };

    setToken = (token) => {
        cookie.set(conf.tokenStorageName, token);
        if (window.localStorage) {
            window.localStorage.setItem(conf.tokenStorageName, token);
        }
    };

    verifyToken = async (token) => {
        const verify = await request('GET', `/auth/verify?token=${token}`);
        console.log(verify);
        return verify;
    };

    isLoggedIn = async () => {
        const token = this.getToken();
        if (!token) {
            return false;
        }
        const verify = await this.verifyToken(token);
        return verify.success;
    };

    clearToken = () => {
        if (window.localStorage) {
            window.localStorage.removeItem('access_token');
        }
        cookie.erase('access_token');
    };
}
