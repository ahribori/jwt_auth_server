import { log, postMessage } from '../../../helpers';
// Singleton Instance
let instance = null;

class MessageHandler {
    constructor() {
        if (!instance) {
            instance = this;
            window.addEventListener('message', this.messageEventListener, false);
        }
        return instance;
    }

    messageEventListener = (event) => {
        try {
            const message = JSON.parse(event.data);
            const { source, origin } = event;
            switch (message.type) {
                case 'popupOnLoad': // 로그인 버튼 클릭해서 팝업창 떴을 때
                    return this.popupOnLoadListener(message, source);
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

    defaultListener = (message, source) => {
    };
}

export default MessageHandler;
