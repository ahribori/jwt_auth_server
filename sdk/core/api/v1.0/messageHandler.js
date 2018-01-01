import cookie from 'browser-cookies';
import { conf, log, postMessage } from '../../../helpers';
// Singleton Instance
let instance = null;

class MessageHandler {
    constructor() {
        if (!instance) {
            instance = this;
            window.addEventListener('message', this.messageEventListener, false);
        }
        this.loginSuccessCallbackList = [];
        this.loginFailCallbackList = [];
        this.loginAlwaysCallbackList = [];
        return instance;
    }

    setToken = (token) => {
        if (window.localStorage) {
            window.localStorage.setItem(conf.tokenStorageName, token);
        } else {
            cookie.set(conf.tokenStorageName, token);
        }
    };

    setLoginSuccessCallback = (success) => {
        if (typeof success === 'function') {
            this.loginSuccessCallbackList.push(success);
        }
    };

    setLoginFailCallback = (fail) => {
        if (typeof fail === 'function') {
            this.loginFailCallbackList.push(fail);
        }
    };

    setLoginAlwaysCallback = (always) => {
        if (typeof always === 'function') {
            this.loginAlwaysCallbackList.push(always);
        }
    };

    messageEventListener = (event) => {
        try {
            const message = JSON.parse(event.data);
            const { source, origin } = event;
            switch (message.type) {
                case 'popupOnLoad': // 로그인 버튼 클릭해서 팝업창 떴을 때
                    return this.popupOnLoadListener(message, source, origin);
                case 'clbOnLoad':
                    return this.clbOnLoadListener(message, source, origin);
                case 'buttonSize':
                    return this.buttonSizeListener(message, source, origin);
                case 'login':
                    return this.loginListener(message, source, origin);
                case 'logout':
                    return this.logoutListener(message, source, origin);
                case 'popupClosed':
                    return this.popupClosedListener(message, source, origin);
                default:
                    return this.defaultListener(message, source, origin);
            }
        } catch (e) {
            log.error(e);
        }
        return null;
    };

    popupOnLoadListener = (message, source, origin) => {
    };

    clbOnLoadListener = async (message, source, origin) => {
        const api = window[conf.globalObjectName];
        const token = api.getToken();
        if (token) {
            postMessage(source, { type: 'tokenExist' }, origin);
            const isLoggedIn = await api.verifyToken({ token });
            if (!isLoggedIn.success) {
                api.clearToken();
            }
            postMessage(source, {
                type: 'isLoggedIn',
                isLoggedIn,
            }, origin);
        }
        postMessage(source, {
            type: 'clbOnLoadConfirm',
            appKey: window[conf.globalObjectName].appKey,
        }, origin);
    };

    buttonSizeListener = (message, source, origin) => {
        const iFrame = document.querySelector(`#__${conf.globalObjectName}_LOGIN_BUTTON__`);
        if (iFrame) {
            iFrame.width = message.width;
            iFrame.height = message.height;
        }
    };

    loginListener = (message, source, origin) => {
        const { success } = message;
        if (success) {
            const { auth } = message;
            this.setToken(auth.token);
            this.loginSuccessCallbackList.map(callback => callback({ success, auth }));
            this.loginAlwaysCallbackList.map(callback => callback({ success, auth }));
        } else {
            const { error } = message;
            this.loginFailCallbackList.map(callback => callback({ success, error }));
            this.loginAlwaysCallbackList.map(callback => callback({ success, error }));
        }
    };

    logoutListener = (message, source, origin) => {
        window[conf.globalObjectName].clearToken();
    };

    popupClosedListener = (message, source, origin) => {
        const success = false;
        const error = {
            message: 'Login popup closed',
        };
        this.loginFailCallbackList.map(callback => callback({ success, error }));
        this.loginAlwaysCallbackList.map(callback => callback({ success, error }));
    };

    defaultListener = (message, source, origin) => {
    };
}

export default MessageHandler;
