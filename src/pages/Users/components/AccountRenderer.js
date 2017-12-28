import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'material-ui/Avatar';

import kakaoImage from './images/kakao_sqare_icon.png';
import facebookImage from './images/facebook_sqare_icon.png';
import googleImage from './images/google_sqare_icon.png';

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
            const imageType = {
                kakao: kakaoImage,
                facebook: facebookImage,
                google: googleImage,
            };
            return (
                <div style={{
                    marginTop: 3,
                }}
                >
                    <Avatar size={40} src={imageType[account_type]} />
                </div>
            );
        }
        return username;
    }
}

export default AccountRenderer;
