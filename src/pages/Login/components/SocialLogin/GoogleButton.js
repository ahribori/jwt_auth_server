import React from 'react';
import PropTypes from 'prop-types';
import googleLogo from './styles/google_logo.png';
import './styles/Style.scss';

class KakaoButton extends React.Component {
    static propTypes = {
        size: PropTypes.number,
        logo: PropTypes.string,
        onClick: PropTypes.func,
    };

    static defaultProps = {
        size: 72,
        logo: googleLogo,
        onClick: () => {},
    };

    render() {
        const buttonStyle = {
            width: this.props.size,
            height: this.props.size,
            backgroundImage: `url(${this.props.logo})`,
            backgroundSize: 'contain',
            border: 0,
            outline: 'none',
            cursor: 'pointer',
        };
        return (
            <button
                style={buttonStyle}
                className="social-login-button"
                onClick={this.props.onClick}
            />
        );
    }
}

export default KakaoButton;
