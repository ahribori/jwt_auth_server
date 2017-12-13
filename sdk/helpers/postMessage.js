import conf from './conf';
import log from './log';

const { serverOrigin } = conf;

export default (targetWindow, messageObject) => {
    try {
        const stringifyObject = JSON.stringify(messageObject);
        targetWindow.postMessage(stringifyObject, serverOrigin);
    } catch (e) {
        log.error(e);
    }
};
