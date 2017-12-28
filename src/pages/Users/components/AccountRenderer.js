import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'material-ui/Avatar';

import kakaoLogo from '../../Login/components/SocialLogin/styles/kakao_logo.png';
import facebookLogo from '../../Login/components/SocialLogin/styles/facebook_logo.png';
import googleLogo from '../../Login/components/SocialLogin/styles/google_logo.png';

class AccountRenderer extends React.Component {
    static propTypes = {};

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { username, account_type } = this.props.value;
        if (account_type) {
            const logoType = {
                kakao: kakaoLogo,
                facebook: facebookLogo,
                google: googleLogo,
            };
            return (
                <div style={{
                    marginTop: 3,
                }}
                >
                    <Avatar size={40} src={logoType[account_type]} style={{ backgroundColor: 'transparent' }} />
                </div>
            );
        }
        return username;
    }
}

export default AccountRenderer;
