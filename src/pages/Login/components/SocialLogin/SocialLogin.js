import React from 'react';
import PropTypes from 'prop-types';
import KakaoLogin from './KakaoLogin';
import FacebookLogin from './FacebookLogin';
import './styles/Style.scss';
import GoogleLogin from './GoogleLogin';

class SocialLogin extends React.Component {
    static propTypes = {
        kakaoKey: PropTypes.string,
        facebookKey: PropTypes.number,
        googleKey: PropTypes.string,
        onLoginSuccess: PropTypes.func,
        onLoginFailure: PropTypes.func,
    };

    static defaultProps = {
        kakaoKey: null,
        facebookKey: null,
        googleKey: null,
        onLoginSuccess: () => {},
        onLoginFailure: () => {},
    };

    onKakaoSuccess = (result) => {
        this.props.onLoginSuccess({
            vendor: 'kakao',
            ...result,
        });
    };

    onFacebookSuccess = (result) => {
        this.props.onLoginSuccess({
            vendor: 'facebook',
            ...result,
        });
    };

    onGoogleSuccess = (result) => {
        this.props.onLoginSuccess({
            vendor: 'google',
            ...result,
        });
    };

    onKakaoFailure = (error) => {
        this.props.onLoginFailure({
            vendor: 'kakao',
            ...error,
        });
    };

    onFacebookFailure = (error) => {
        this.props.onLoginFailure({
            vendor: 'facebook',
            ...error,
        });
    };

    onGoogleFailure = (error) => {
        this.props.onLoginFailure({
            vendor: 'google',
            ...error,
        });
    };

    render() {
        const containerStyle = {
            display: 'flex',
            justifyContent: 'center',
            marginTop: 20,
            marginBottom: 20,
        };

        const itemStyle = {
            flexBasis: 90,
        };

        return (
            <div style={containerStyle} className="social-login-container">
                <span style={itemStyle} className="social-login-item">
                    {
                        this.props.kakaoKey
                        &&
                        <KakaoLogin
                            kakaoKey={this.props.kakaoKey}
                            onSuccess={this.onKakaoSuccess}
                            onFailure={this.onKakaoFailure}
                            getProfile
                        />
                    }
                </span>
                <span style={itemStyle} className="social-login-item">
                    {
                        this.props.facebookKey
                        &&
                        <FacebookLogin
                            facebookKey={this.props.facebookKey}
                            onSuccess={this.onFacebookSuccess}
                            onFailure={this.onFacebookFailure}
                        />
                    }
                </span>
                <span style={itemStyle} className="social-login-item">
                    {
                        this.props.googleKey
                        &&
                        <GoogleLogin
                            googleKey={this.props.googleKey}
                            onSuccess={this.onGoogleSuccess}
                            onFailure={this.onGoogleFailure}
                        />
                    }
                </span>
            </div>
        );
    }
}

export default SocialLogin;
