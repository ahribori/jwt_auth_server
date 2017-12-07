import React, { Component } from 'react';
import {
    withRouter,
} from 'react-router-dom';
import url from 'url';

import './style/App.scss';
import routes from './routes';
import withAuth from './lib/hoc/withAuth';

@withAuth
class App extends Component {
    componentWillReceiveProps(nextProps) {
        const { pathname } = this.props.location;
        const { query } = url.parse(window.location.href, window.location.search);
        const redirectURL = query ? query.continue : null;
        if (redirectURL) {
            // TODO redirect url + token을 보냈을 때 탈취 위험 고려
            this.redirectTo(`${redirectURL}?token=${this.props.auth.token}`);
            return;
        }
        if (nextProps.isLoggedIn && pathname !== '/myPage') {
            this.redirectTo('/myPage');
        }
    }

    redirectTo = (continueURL) => {
        window.location.replace(continueURL);
    };

    render() {
        return (
            <div className="App">
                {routes}
            </div>
        );
    }
}

export default withRouter(App);
