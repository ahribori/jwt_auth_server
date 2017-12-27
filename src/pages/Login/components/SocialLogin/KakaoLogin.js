import React from 'react';
import PropTypes from 'prop-types';
import KakaoButton from './KakaoButton';

class KakaoLogin extends React.Component {
    static propTypes = {
        kakaoKey: PropTypes.string,
        getProfile: PropTypes.bool,
        onSuccess: PropTypes.func,
        onFailure: PropTypes.func,
    };

    static defaultProps = {
        kakaoKey: null,
        getProfile: false,
        onSuccess: () => {},
        onFailure: () => {},
    };

    componentDidMount() {
        const { kakaoKey } = this.props;

        ((d, s, id, cb) => {
            const element = d.getElementsByTagName(s)[0];
            const fjs = element;
            let js = element;

            js = d.createElement(s);
            js.id = id;
            js.src = '//developers.kakao.com/sdk/js/kakao.min.js';
            fjs.parentNode.insertBefore(js, fjs);
            js.onload = cb;
        })(document, 'script', 'kakao-sdk', () => {
            window.Kakao.init(kakaoKey);
        });
    }

    handleClick = () => {
        const { getProfile, onSuccess, onFailure } = this.props;
        const { Kakao } = window;
        if (Kakao.Auth) {
            Kakao.Auth.login({
                throughTalk: false,
                success: (response) => {
                    if (getProfile) {
                        Kakao.API.request({
                            url: '/v1/user/me',
                            success: (me) => {
                                const { id } = me;
                                Kakao.API.request({
                                    url: '/v1/api/talk/profile',
                                    data: {
                                        secure_resource: true,
                                    },
                                    success: (profile) => {
                                        const nickname = profile.nickName;
                                        const thumbnailImage = profile.thumbnailURL;
                                        onSuccess({
                                            auth: response,
                                            profile: {
                                                id,
                                                nickname,
                                                thumbnailImage,
                                            },
                                        });
                                    },
                                });
                            },
                            fail: (error) => {
                                onFailure(error);
                            },
                        });
                    } else {
                        onSuccess({ response });
                    }
                },
                fail: onFailure,
            });
        } else {
            console.error('Kakao.Auth must be initialize');
        }
    };

    render() {
        return <KakaoButton onClick={this.handleClick} />;
    }
}

export default KakaoLogin;
