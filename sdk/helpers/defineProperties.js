import conf from './conf';

export default (key, value) => {
    Object.defineProperties(window[conf.globalObjectName], {
        [key]: {
            value,
            writable: false,
            enumerable: false,
            configurable: false,
        },
    });
};
