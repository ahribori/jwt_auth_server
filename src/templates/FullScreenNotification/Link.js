import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

class Link extends React.Component {
    static propTypes = {
        text: PropTypes.string,
        color: PropTypes.string,
        to: PropTypes.string,
        onClick: PropTypes.func,
    };

    static defaultProps = {
        text: '링크',
        color: 'white',
        to: '/',
        onClick: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
        };
    }

    redirect = () => {
        this.setState({
            redirect: true,
        });
    };

    render() {
        const style = {
            color: this.props.color,
            cursor: 'pointer',
            margin: '15px',
        };
        if (this.state.redirect) {
            return <Redirect to={this.props.to} />;
        }
        return (
            <div
                style={style}
                onClick={!this.props.onClick ? this.redirect : this.props.onClick}
                className="Link"
            >
                {this.props.text}
            </div>
        );
    }
}

export default Link;
