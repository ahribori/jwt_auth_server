import { log, postMessage, defineProperties } from '../../../helpers';
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
                    return this.popupOnLoadListener(message, source);
                case 'login':
                    return this.loginListener(message, source);
                default:
                    return this.defaultListener(message, source);
            }
        } catch (e) {
            log.error(e);
        }
        return null;
    };

    popupOnLoadListener = (message, source) => {
    };

    loginListener = (message, source) => {
        const { success } = message;
        if (success) {
            const { auth } = message;
            this.loginSuccessCallbackList.map(callback => callback({ success, auth }));
            this.loginAlwaysCallbackList.map(callback => callback({ success, auth }));
        } else {
            const { error } = message;
            this.loginFailCallbackList.map(callback => callback({ success, error }));
            this.loginAlwaysCallbackList.map(callback => callback({ success, error }));
        }
    };

    defaultListener = (message, source) => {
    };
}

export default MessageHandler;
