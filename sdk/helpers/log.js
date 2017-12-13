const getMessage = message => `[AUTH_SDK] ${message}`;

export default {
    error: (message) => {
        console.error(getMessage(message));
    },
    warn: (message) => {
        console.warn(getMessage(message));
    },
    info: (message) => {
        console.info(getMessage(message));
    },
};
