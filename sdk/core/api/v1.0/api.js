import cookie from 'browser-cookies';
import { request, log, conf } from '../../../helpers';
import MessageHandler from './messageHandler';

const messageHandler = new MessageHandler();

export default class API {
    constructor() {
        log.info('API 1.0 Initialized');
        this.verify = false;
        return {
            createLoginButton: this.createLoginButton,
            assignLoginButton: this.assignLoginButton,
            getToken: this.getToken,
            verifyToken: this.verifyToken,
            clearToken: this.clearToken,
        };
    }

    verifySDK = async () => {
        if (!this.verify) {
            await request({
                method: 'GET',
                path: '/v1.0/sdk/verify',
            });
        }
        this.verify = true;
    };

    createLoginButton = async ({
        container,
        size = 'md',
        success,
        fail,
        always,
        popup = true,
    }) => {
        await this.verifySDK();

        const $container = document.querySelector(container);
        if (!$container) {
            return log.error(`셀렉터 ${container} 와 일치하는 엘리먼트가 존재하지 않습니다`);
        }

        const iFrame =
            '<iframe ' +
            `id="__${conf.globalObjectName}_LOGIN_BUTTON__" ` +
            `src="${conf.serverOrigin}/api/v1.0/sdk/createLoginButton?size=${size}" ` +
            '/>';
        $container.innerHTML = iFrame;
        const $frame = document.querySelector(`${container} > iframe`);
        $frame.width = 0;
        $frame.height = 0;
        $frame.style.border = 0;

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

    assignLoginButton = async ({
        selector,
        target,
        success,
        fail,
        always,
        popup = true,
    }) => {
        await this.verifySDK();
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
                    'resizable=no, width=800, height=700',
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

    verifyToken = async ({
        token,
        success,
        fail,
        always,
    }) => {
        const t = token || this.getToken();
        if (!t) {
            const result = {
                success: false,
                payload: {
                    message: '검증할 토큰이 존재하지 않습니다',
                },
            };
            if (typeof fail === 'function') { fail(result); }
            if (typeof always === 'function') { always(result); }
            return result;
        }
        try {
            const verify = await request({
                method: 'GET',
                path: '/v1.0/auth/verify',
                authorization: t,
                logging: false,
            });
            const result = {
                success: true,
                payload: verify.data,
            };
            if (typeof success === 'function') { success(result); }
            if (typeof always === 'function') { always(result); }
            return result;
        } catch (e) {
            const result = {
                success: false,
                payload: {
                    message: e.data.message,
                },
            };
            if (typeof fail === 'function') { fail(result); }
            if (typeof always === 'function') { always(result); }
            return result;
        }
    };

    clearToken = () => {
        if (window.localStorage) {
            window.localStorage.removeItem(conf.tokenStorageName);
        }
        cookie.erase(conf.tokenStorageName);
    };
}
