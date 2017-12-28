import React from 'react';
import PropTypes from 'prop-types';
import NaverButton from './NaverButton';

class NaverLogin extends React.Component {
    static propTypes = {
        naverKey: PropTypes.string,
        onSuccess: PropTypes.func,
        onFailure: PropTypes.func,
    };

    static defaultProps = {
        naverKey: null,
        onSuccess: () => {},
        onFailure: () => {},
    };

    componentDidMount() {
        window.addEventListener('message', this.postMessageListener, false);
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
    }

    componentWillUnmount() {
        window.removeEventListener('message', this.postMessageListener);
    }

    postMessageListener = (event) => {
        try {
            const message = JSON.parse(event.data);
            const { type } = message;
            if (type && type === 'nil') {
                if (!message.error) {
                    const { user, loginStatus } = message;
                    this.props.onSuccess({
                        auth: loginStatus,
                        profile: {
                            id: user.id,
                            nickname: user.nickname,
                            thumbnailImage: user.profile_image,
                        },
                    });
                } else {
                    this.props.onFailure({
                        message: message.error,
                    });
                }
            }
        } catch (e) {}
    };

    handleClick = () => {
        const url = window.naverLogin.generateAuthorizeUrl();
        window.open(
            url, 'targetWindow',
            'toolbar=no, location=no, status=no, menubar=no, scrollbars=no, ' +
            'resizable=no, width=800, height=700',
        );
    };

    render() {
        return (
            <NaverButton onClick={this.handleClick} />
        );
    }
}

export default NaverLogin;
