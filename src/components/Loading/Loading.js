import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from 'material-ui/CircularProgress';

class Loading extends React.Component {
    static propTypes = {
        size: PropTypes.number,
        thickness: PropTypes.number,
        text: PropTypes.string,
    };

    static defaultProps = {
        size: 80,
        thickness: 5,
        text: '',
    };

    render() {
        const containerStyle = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 30,
        };

        const textStyle = {
            position: 'absolute',
        };

        return (
            <div style={containerStyle}>
                <span style={textStyle}>{this.props.text}</span>
                <CircularProgress size={this.props.size} thickness={this.props.thickness} />
            </div>
        );
    }
}

export default Loading;
