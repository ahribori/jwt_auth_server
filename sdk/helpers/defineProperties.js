import conf from './conf';

export default (key, value, targetObject) => {
    Object.defineProperties(targetObject || window[conf.globalObjectName], {
        [key]: {
            value,
            writable: false,
            enumerable: false,
            configurable: false,
        },
    });
};
