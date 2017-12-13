export default (targetWindow, messageObject, targetOrigin) => {
    try {
        const stringifyObject = JSON.stringify(messageObject);
        targetWindow.postMessage(stringifyObject, targetOrigin);
    } catch (e) {
        console.error(e);
    }
};
