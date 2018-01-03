import cookie from 'browser-cookies';
import { request, log, conf } from '../../../helpers';
import MessageHandler from './messageHandler';
import './clb.scss';

const messageHandler = new MessageHandler();


export default
/**
 * JWT 인증 소프트웨어 개발 도구
 * @class AUTH_SDK
 * @param {string} APPLICATION_KEY 어플리케이션을 만들 때 발급받은 어플리케이션 키
 */
class API {
    constructor() {
        log.info('API 1.0 Initialized');
        this.verify = false;
        this.loginStatus = false;
        this.createLoginButton = this.createLoginButton.bind(this);
        this.createLoginButtonSSR = this.createLoginButtonSSR.bind(this);
        this.assignLoginButton = this.assignLoginButton.bind(this);
        this.getToken = this.getToken.bind(this);
        this.verifyToken = this.verifyToken.bind(this);
        this.clearToken = this.clearToken.bind(this);
        return {
            createLoginButton: this.createLoginButton,
            createLoginButtonSSR: this.createLoginButtonSSR,
            assignLoginButton: this.assignLoginButton,
            getUser: this.getUser,
            getToken: this.getToken,
            verifyToken: this.verifyToken,
            clearToken: this.clearToken,
        };
    }

    setStatusLoggedIn = () => {
        this.loginStatus = true;
    };

    setStatusNotLoggedIn = () => {
        this.loginStatus = false;
    };

    verifySDK = async () => {
        if (!this.verify) {
            await request({
                method: 'GET',
                path: '/v1.0/sdk/verify',
            });
        }
        this.verify = true;
    };

    popupLogin = () => {
        const requestUrl = `${conf.serverOrigin}/login?` +
            `a=${btoa(window[conf.globalObjectName].appKey)}&` +
            `o=${encodeURIComponent(window.location.origin)}`;
        return window.open(
            requestUrl, 'targetWindow',
            'toolbar=no, location=no, status=no, menubar=no, scrollbars=no, ' +
            'resizable=no, width=800, height=700',
        );
    };

    /**
     * 컨테이너 요소 내부에 로그인 버튼을 만듭니다.
     *
     * @example
     * var auth = new AUTH_SDK('YOUR_APPLICATION_KEY');
     *
     * auth.createLoginButton({
     *     container: '#YOUR DIV ID',
     *     size: 'md',
     *     success: function(authObject) {
     *
     *     },
     *     fail: function(errorObject) {
     *
     *     },
     *     always: function(authOrErrorObject) {
     *
     *     },
     *     logout: function() {
     *
     *     }
     * });
     *
     * @method
     * @name createLoginButton
     * @param settings {Object} createLoginButton 설정
     * @param settings.container {string} 로그인버튼이 삽입될 컨테이너 셀렉터
     * @param settings.size {string} 삽입할 버튼의 사이즈 (xs | sm | md | lg | xl)
     * @param settings.success {function} 로그인 성공 콜백 함수
     * @param settings.fail {function} 로그인 실패 콜백 함수
     * @param settings.always {function} 성공 실패 유무에 관계없는 콜백
     * @param settings.logout {function} 로그아웃하고 나서 콜백
     * @memberof AUTH_SDK
     */
    async createLoginButton({
        container,
        size = 'md',
        success,
        fail,
        always,
    }) {
        await this.verifySDK();

        const $container = document.querySelector(container);
        if (!$container) {
            return log.error(`셀렉터 ${container} 와 일치하는 엘리먼트가 존재하지 않습니다`);
        }

        const token = this.getToken();
        if (token) {
            this.setStatusLoggedIn();
        }

        const isLoggedIn = await this.verifyToken({ token });
        if (!isLoggedIn.success) {
            this.setStatusNotLoggedIn();
            this.clearToken();
        }

        $container.innerHTML = `<button id="__CREATE_LOGIN_BUTTON__">${this.loginStatus ? '로그아웃' : '로그인'}</button>`;
        const $button = document.querySelector(`${container} > #__CREATE_LOGIN_BUTTON__`);
        $button.className += size;

        $button.onclick = () => {
            if (!this.loginStatus) {
                this.popupLogin();
            } else {
                this.clearToken();
                this.setStatusNotLoggedIn();
                $button.innerHTML = '로그인';
            }
        };

        if (typeof success === 'function') {
            messageHandler.setLoginSuccessCallback((result) => {
                this.setStatusLoggedIn();
                $button.innerHTML = '로그아웃';
                success(result);
            });
        }
        if (typeof fail === 'function') {
            messageHandler.setLoginFailCallback(fail);
        }
        if (typeof always === 'function') {
            messageHandler.setLoginAlwaysCallback((result) => {
                if (result.success) {
                    this.setStatusLoggedIn();
                    $button.innerHTML = '로그아웃';
                }
                always(result);
            });
        }
        return null;
    };

    /**
     * 컨테이너 요소 내부에 로그인 버튼을 만듭니다.
     * createLoginButton과 같은 기능이지만 서버사이드에서 버튼을 렌더링합니다.
     *
     * @example
     * var auth = new AUTH_SDK('YOUR_APPLICATION_KEY');
     *
     * auth.createLoginButtonSSR({
     *     container: '#YOUR DIV ID',
     *     size: 'md',
     *     success: function(authObject) {
     *
     *     },
     *     fail: function(errorObject) {
     *
     *     },
     *     always: function(authOrErrorObject) {
     *
     *     },
     *     logout: function() {
     *
     *     }
     * });
     *
     * @method
     * @name createLoginButtonSSR
     * @param settings {Object} createLoginButtonSSR 설정
     * @param settings.container {string} 로그인버튼이 삽입될 컨테이너 셀렉터
     * @param settings.size {string} 삽입할 버튼의 사이즈 (xs | sm | md | lg | xl)
     * @param settings.success {function} 로그인 성공 콜백 함수
     * @param settings.fail {function} 로그인 실패 콜백 함수
     * @param settings.always {function} 성공 실패 유무에 관계없는 콜백
     * @param settings.logout {function} 로그아웃하고 나서 콜백
     * @memberof AUTH_SDK
     */
    async createLoginButtonSSR({
        container,
        size = 'md',
        success,
        fail,
        always,
    }) {
        await this.verifySDK();

        const $container = document.querySelector(container);
        if (!$container) {
            return log.error(`셀렉터 ${container} 와 일치하는 엘리먼트가 존재하지 않습니다`);
        }

        const iFrame =
            '<iframe ' +
            `id="__${conf.globalObjectName}_LOGIN_BUTTON__" ` +
            `src="${conf.serverOrigin}/api/v1.0/sdk/createLoginButton?size=${size}" ` +
            '/>';
        $container.innerHTML = iFrame;
        const $frame = document.querySelector(`${container} > iframe`);
        $frame.width = 0;
        $frame.height = 0;
        $frame.style.border = 0;

        if (typeof success === 'function') {
            messageHandler.setLoginSuccessCallback(success);
        }
        if (typeof fail === 'function') {
            messageHandler.setLoginFailCallback(fail);
        }
        if (typeof always === 'function') {
            messageHandler.setLoginAlwaysCallback(always);
        }
        return null;
    };

    /**
     * 컨테이너 요소 내부에 로그인 버튼을 만듭니다.
     *
     * @example
     * var auth = new AUTH_SDK('YOUR_APPLICATION_KEY');
     *
     * auth.assignLoginButton({
     *     target: '#YOUR BUTTON ID',
     *     success: function(authObject) {
     *
     *     },
     *     fail: function(errorObject) {
     *
     *     },
     *     always: function(authOrErrorObject) {
     *
     *     },
     * });
     *
     * @method
     * @name assignLoginButton
     * @param settings {Object} assignLoginButton 설정
     * @param settings.selector {string} 로그인 버튼 셀렉터
     * @param settings.target {string} 로그인 버튼 셀렉터
     * @param settings.success {function} 로그인 성공 콜백 함수
     * @param settings.fail {function} 로그인 실패 콜백 함수
     * @param settings.always {function} 성공 실패 유무에 관계없는 콜백
     * @memberof AUTH_SDK
     */
    async assignLoginButton({
        selector,
        target,
        success,
        fail,
        always,
    }) {
        await this.verifySDK();
        const _selector = selector || target;
        const element = document.querySelector(_selector);
        if (!element) {
            return log.error(`셀렉터 ${_selector} 와 일치하는 엘리먼트가 존재하지 않습니다`);
        }
        element.onclick = () => {
            this.popupLogin();
        };

        if (typeof success === 'function') {
            messageHandler.setLoginSuccessCallback(success);
        }
        if (typeof fail === 'function') {
            messageHandler.setLoginFailCallback(fail);
        }
        if (typeof always === 'function') {
            messageHandler.setLoginAlwaysCallback(always);
        }
        return null;
    };

    /**
     * 엑세스 토큰으로 유저 정보를 가져옵니다.
     *
     * @example
     * var auth = new AUTH_SDK('YOUR_APPLICATION_KEY');
     *
     * auth.getUser({
     *     token: auth.getToken(),
     *     success: function(result) {
     *          console.log(result);
     *     },
     * });
     *
     * @method
     * @name getUser
     * @param settings {Object} getUser 설정
     * @param settings.token {string} 엑세스 토큰
     * @param settings.success {function} 사용자 정보 가져오기 성공 콜백 함수
     * @param settings.fail {function} 사용자 정보 가져오기 실패 콜백 함수
     * @param settings.always {function} 성공 실패 유무에 관계없는 콜백
     * @memberof AUTH_SDK
     */
    async getUser({
        token,
        success,
        fail,
        always,
    }) {
        try {
            const t = token || this.getToken();
            if (!t) {
                const result = {
                    success: false,
                    payload: {
                        message: '검증할 토큰이 존재하지 않습니다',
                    },
                };
                if (typeof fail === 'function') { fail(result); }
                if (typeof always === 'function') { always(result); }
                return result;
            }
            const user = await request({
                method: 'GET',
                path: '/v1.0/user',
                authorization: t,
                logging: false,
            });
            const result = {
                success: true,
                user: user.data,
            };
            if (typeof success === 'function') { success(result); }
            if (typeof always === 'function') { always(result); }
            return result;
        } catch (e) {
            const result = {
                success: false,
                payload: {
                    message: e.data.message,
                },
            };
            if (typeof fail === 'function') { fail(result); }
            if (typeof always === 'function') { always(result); }
            return result;
        }
    };

    /**
     * 스토리지에 저장된 토큰을 꺼내옵니다. 토큰이 존재하지 않으면 null을 return합니다.
     *
     * @example
     * var auth = new AUTH_SDK('YOUR_APPLICATION_KEY');
     *
     * var token = auth.getToken();
     *
     * @method
     * @name getToken
     * @memberof AUTH_SDK
     */
    getToken() {
        let token = null;
        if (window.localStorage) {
            token = window.localStorage.getItem(conf.tokenStorageName);
        }
        if (!token) {
            token = cookie.get(conf.tokenStorageName);
        }
        return token;
    };

    /**
     * 토큰이 유효한지 검증하고 JWT의 payload를 확인합니다.
     *
     * @example
     * var auth = new AUTH_SDK('YOUR_APPLICATION_KEY');
     *
     * auth.verifyToken({
     *     token: auth.getToken(),
     *     success: function(result) {
     *          console.log(result);
     *     },
     * });
     *
     * @method
     * @name verifyToken
     * @param settings {Object} verifyToken 설정
     * @param settings.token {string} 검증할 토큰
     * @param settings.success {function} 토큰 검증 성공 콜백 함수
     * @param settings.fail {function} 토큰 검증 실패 콜백 함수
     * @param settings.always {function} 성공 실패 유무에 관계없는 콜백
     * @memberof AUTH_SDK
     */
    async verifyToken({
        token,
        success,
        fail,
        always,
    }) {
        const t = token || this.getToken();
        if (!t) {
            const result = {
                success: false,
                payload: {
                    message: '검증할 토큰이 존재하지 않습니다',
                },
            };
            if (typeof fail === 'function') { fail(result); }
            if (typeof always === 'function') { always(result); }
            return result;
        }
        try {
            const verify = await request({
                method: 'GET',
                path: '/v1.0/auth/verify',
                authorization: t,
                logging: false,
            });
            const result = {
                success: true,
                payload: verify.data,
            };
            if (typeof success === 'function') { success(result); }
            if (typeof always === 'function') { always(result); }
            return result;
        } catch (e) {
            const result = {
                success: false,
                payload: {
                    message: e.data.message,
                },
            };
            if (typeof fail === 'function') { fail(result); }
            if (typeof always === 'function') { always(result); }
            return result;
        }
    };

    /**
     * 스토리지에 저장된 토큰을 삭제합니다.
     *
     * @example
     * var auth = new AUTH_SDK('YOUR_APPLICATION_KEY');
     *
     * auth.clearToken();
     *
     * @method
     * @name getToken
     * @memberof AUTH_SDK
     */
    clearToken() {
        if (window.localStorage) {
            window.localStorage.removeItem(conf.tokenStorageName);
        }
        cookie.erase(conf.tokenStorageName);
    };
}
