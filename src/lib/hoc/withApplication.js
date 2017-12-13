import React from 'react';
import { connect } from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';
import {
    pinkA200 as loadingProgressColor,
    white as loadingFontColor,
} from 'material-ui/styles/colors';
import url from 'url';
import * as application from '../../ducks/Application';

const mapStateToProps = (state) => {
    return {
        application: state.application.get('fetch_for_sdk'),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getApplicationRequest: appKey => dispatch(application.fetchForSdk(appKey)),
    };
};

export default WrappedComponent => connect(mapStateToProps, mapDispatchToProps)(class withApplication extends React.Component {
    constructor(props) {
        super(props);
        const { query } = url.parse(window.location.href, window.location.search);
        const { a, o, r } = query || {};

        this.state = {
            pending: true,
            appKey: a,
            origin: o,
            redirect: r,
        };
    }

    async componentDidMount() {
        if (this.state.appKey) {
            await this.props.getApplicationRequest(atob(this.state.appKey));
            this.setState({ pending: false });
        } else {
            this.setState({ pending: false });
        }
    }

    render() {
        if (this.state.pending) {
            return (
                <div className="loading">
                    <CircularProgress color={loadingProgressColor} size={150} thickness={7} />
                    <p style={{ color: loadingFontColor }}>로딩중...</p>
                </div>
            );
        }
        const newProps = {
            application: this.props.application,
        };
        return (
            <WrappedComponent {...newProps} {...this.props} />
        );
    }
});

