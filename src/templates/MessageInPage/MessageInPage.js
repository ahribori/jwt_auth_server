import React from 'react';
import PropTypes from 'prop-types';
import {
    grey800 as fontColor,
    grey500 as iconColor,
} from 'material-ui/styles/colors';
import WarningIcon from 'material-ui/svg-icons/alert/warning';

class MessageInPage extends React.Component {
    static propTypes = {
        message: PropTypes.string,
        size: PropTypes.number,
    };

    static defaultProps = {
        message: '메세지',
        size: 18,
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const containerStyle = {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            paddingTop: 100,
            paddingBottom: 100,
            fontSize: this.props.size,
            color: fontColor,
            fontWeight: 'bold',
        };

        return (
            <div style={containerStyle}>
                <WarningIcon style={{ height: 40, width: 40, color: iconColor }} />
                {this.props.message}
            </div>
        );
    }
}

export default MessageInPage;
