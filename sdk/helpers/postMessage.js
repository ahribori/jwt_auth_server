import conf from './conf';
import log from './log';

const { serverOrigin } = conf;

export default (targetWindow, messageObject, origin) => {
    try {
        const stringifyObject = JSON.stringify(messageObject);
        targetWindow.postMessage(stringifyObject, origin || serverOrigin);
    } catch (e) {
        log.error(e);
    }
};
