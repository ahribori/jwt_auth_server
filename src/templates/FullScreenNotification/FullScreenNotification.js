import React from 'react';
import {
    white as fontColor,
} from 'material-ui/styles/colors';
import Link from './Link';
import './style/FullScreenNotification.scss';

class FullScreenNotification extends React.Component {
    static Link = Link;

    render() {
        const style = {
            color: fontColor,
        };

        return (
            <div
                className="FullScreenNotification"
                style={style}
            >
                {this.props.children}
            </div>
        );
    }
}

export default FullScreenNotification;
