import React from 'react';
import { Redirect } from 'react-router-dom';
import CircularProgress from 'material-ui/CircularProgress';
import {
    pinkA200 as loadingProgressColor,
    white as loadingFontColor,
} from 'material-ui/styles/colors';

class NILCallback extends React.Component {
    state = {
        pending: true,
        isLoggedIn: false,
    };

    componentDidMount() {
        if (!window.opener) {
            return this.setState({ pending: false });
        }
        const { naverKey } = this.props;
        ((d, s, id, cb) => {
            const element = d.getElementsByTagName(s)[0];
            const fjs = element;
            let js = element;

            js = d.createElement(s);
            js.id = id;
            js.src = '//static.nid.naver.com/js/naveridlogin_js_sdk_2.0.0.js';
            fjs.parentNode.insertBefore(js, fjs);
            js.onload = cb;
        })(document, 'script', 'naver-sdk', () => {
            window.naverLogin = new window.naver.LoginWithNaverId({
                clientId: naverKey,
                callbackUrl: `${window.location.origin}/nil`,
                isPopup: true,
            });
            window.naverLogin.init();
        });
        window.addEventListener('load', () => {
            window.naverLogin.getLoginStatus((status) => {
                if (status) {
                    const { user, loginStatus } = window.naverLogin;
                    this.sendAuthToOpener({
                        type: 'nil',
                        user,
                        loginStatus,
                    });
                    return this.setState({ pending: false, isLoggedIn: true });
                }
                window.opener.postMessage(JSON.stringify({
                    type: 'nil',
                    error: 'authentication failed',
                }), window.opener.origin);
                return this.setState({ pending: false });
            });
        });
        return null;
    }

    sendAuthToOpener = (authObj) => {
        try {
            window.opener.postMessage(JSON.stringify(authObj), window.opener.origin);
            window.self.opener = window.self;
            window.self.close();
        } catch (e) {
            console.error(e);
        }
    };

    render() {
        if (!this.state.pending && !this.state.isLoggedIn) {
            return <Redirect to="/" />;
        }
        return (
            <div className="loading">
                <CircularProgress color={loadingProgressColor} size={150} thickness={7} />
                <p style={{ color: loadingFontColor }}>로딩중...</p>
            </div>
        );
    }
}

export default NILCallback;
