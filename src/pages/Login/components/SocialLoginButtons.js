import React from 'react';
import PropTypes from 'prop-types';
import KakaoButton from './KakaoButton';
import FacebookButton from './FacebookButton';
import GoogleButton from './GoogleButton';

class SocialLoginButtons extends React.Component {

    static propTypes = {
        buttonSize: PropTypes.number,
    };

    static defaultProps = {
        buttonSize: 72,
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

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
            <div style={containerStyle}>
                <span style={itemStyle}>
                    <KakaoButton size={this.props.buttonSize} />
                </span>
                <span style={itemStyle}>
                    <FacebookButton size={this.props.buttonSize} />
                </span>
                <span style={itemStyle}>
                    <GoogleButton size={this.props.buttonSize} />
                </span>
            </div>
        );
    }
}

export default SocialLoginButtons;