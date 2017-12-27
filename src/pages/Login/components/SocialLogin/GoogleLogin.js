import React from 'react';
import PropTypes from 'prop-types';
import ReactGoogleLogin from 'react-google-login';
import GoogleButton from './GoogleButton';

class GoogleLogin extends React.Component {
    static propTypes = {
        googleKey: PropTypes.string,
        onSuccess: PropTypes.func,
        onFailure: PropTypes.func,
    };

    static defaultProps = {
        googleKey: null,
        onSuccess: () => {},
        onFailure: () => {},
    };

    callback = (result) => {
        const { accessToken } = result;
        if (accessToken) {
            this.props.onSuccess({
                auth: result.tokenObj,
                profile: {
                    id: result.profileObj.googleId,
                    nickname: result.profileObj.name,
                    thumbnailImage: result.profileObj.imageUrl,
                },
            });
        } else {
            this.props.onFailure(result);
        }
    };

    render() {
        return (
            <ReactGoogleLogin
                clientId={this.props.googleKey}
                tag={GoogleButton}
                onSuccess={this.callback}
                onFailure={this.callback}
            />
        );
    }
}

export default GoogleLogin;
