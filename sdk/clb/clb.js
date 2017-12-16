import './clb.scss';

const parentWindow = window.parent;
const button = document.querySelector('#clb');
const serverOrigin = window.location.origin;
let parentWindowOrigin = null;

let visibleState = 'LOGIN';

const setVisibleLogout = () => {
    button.innerHTML = '로그아웃';
    visibleState = 'LOGOUT';
};

const setVisibleLogin = () => {
    button.innerHTML = '로그인';
    visibleState = 'LOGIN';
};

const logout = () => {
    parentWindow.postMessage(JSON.stringify({
        type: 'logout',
    }), parentWindowOrigin);
};

const clbOnLoadConfirmListener = (message, source, origin) => {
    parentWindowOrigin = origin;
    const { appKey } = message;
    button.onclick = () => {
        if (visibleState === 'LOGIN') {
            const requestUrl = `${serverOrigin}/login?` +
                `a=${btoa(appKey)}&` +
                `o=${encodeURIComponent(origin)}`;
            window.open(
                requestUrl, 'targetWindow',
                'toolbar=no, location=no, status=no, menubar=no, scrollbars=no, ' +
                'resizable=no, width=800, height=600',
            );
        } else if (visibleState === 'LOGOUT') {
            setVisibleLogin();
            logout();
        }
    };
};

const loginListener = (message, source, origin) => {
    parentWindow.postMessage(JSON.stringify(message), parentWindowOrigin);
    if (message.success) {
        setVisibleLogout();
    }
};

const tokenExistListener = (message, source, origin) => {
    setVisibleLogout();
};

const isLoggedInListener = (message, source, origin) => {
    if (message.isLoggedIn.success) {
        setVisibleLogout();
    } else {
        setVisibleLogin();
    }
};

const defaultListener = (message, source, origin) => {
};

const postMessageListener = (event) => {
    const message = JSON.parse(event.data);
    const { source, origin } = event;
    switch (message.type) {
        case 'clbOnLoadConfirm':
            return clbOnLoadConfirmListener(message, source, origin);
        case 'login':
            return loginListener(message, source, origin);
        case 'tokenExist':
            return tokenExistListener(message, source, origin);
        case 'isLoggedIn':
            return isLoggedInListener(message, source, origin);
        default:
            return defaultListener(message, source, origin);
    }
};

window.onload = () => {
    window.addEventListener('message', postMessageListener, false);
    parentWindow.postMessage(JSON.stringify({ type: 'clbOnLoad' }), '*');
    parentWindow.postMessage(JSON.stringify({
        type: 'buttonSize',
        width: button.offsetWidth,
        height: button.offsetHeight,
    }), '*');
};
