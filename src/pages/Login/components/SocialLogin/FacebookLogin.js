import React from 'react';
import PropTypes from 'prop-types';
import ReactFacebookLogin from 'react-facebook-login';
import FacebookButton from './FacebookButton';

class FacebookLogin extends React.Component {
    static propTypes = {
        facebookKey: PropTypes.number,
        onSuccess: PropTypes.func,
        onFailure: PropTypes.func,
    };

    static defaultProps = {
        facebookKey: null,
        onSuccess: () => {},
        onFailure: () => {},
    };

    callback = (result) => {
        const { accessToken } = result;
        if (accessToken) {
            this.props.onSuccess({
                auth: {
                    access_token: accessToken,
                    expiresIn: result.expiresIn,
                },
                profile: {
                    id: result.id,
                    nickname: result.name,
                    thumbnailImage: result.picture.data.url,
                },
            });
        } else {
            this.props.onFailure(result);
        }
    };

    render() {
        return (
            <ReactFacebookLogin
                appId={this.props.facebookKey}
                tag={FacebookButton}
                autoLoad={false}
                fields="name,email,picture"
                language="ko_KR"
                callback={this.callback}
                containerStyle={{
                    opacity: 'none',
                }}
            />
        );
    }
}

export default FacebookLogin;
