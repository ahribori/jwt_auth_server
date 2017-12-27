import React from 'react';
import PropTypes from 'prop-types';
import KakaoLogin from './KakaoLogin';
import FacebookLogin from './FacebookLogin';
import './styles/Style.scss';
import GoogleLogin from './GoogleLogin';

class SocialLogin extends React.Component {
    static propTypes = {
        success: PropTypes.func,
        kakaoKey: PropTypes.string,
        facebookKey: PropTypes.number,
        googleKey: PropTypes.string,
    };

    static defaultProps = {
        success: () => {},
        kakaoKey: null,
        facebookKey: null,
        googleKey: null,
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    onKakaoSuccess = (result) => {
        this.props.success({
            vendor: 'kakao',
            ...result,
        });
    };

    onFacebookSuccess = (result) => {
        this.props.success({
            vendor: 'facebook',
            ...result,
        });
    };

    onGoogleSuccess = (result) => {
        this.props.success({
            vendor: 'google',
            ...result,
        });
    };

    onKakaoFailure = (error) => {
        console.error(error);
    };

    onFacebookFailure = (result) => {
        console.error(result);
    };

    onGoogleFailure = (error) => {
        console.error(error);
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
