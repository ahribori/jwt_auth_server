import React, { Component } from 'react';
import {
    Link,
    withRouter,
} from 'react-router-dom';

import './style/App.scss';
import routes from './routes';
import withAuth from './lib/hoc/withAuth';

@withAuth
class App extends Component {
    renderMenu = () => (
        <div>
            <ul>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/join">Join</Link></li>
            </ul>
        </div>
    );

    renderContents = () => (
        <div>
            {routes}
        </div>
    );

    render() {
        return (
            <div className="App">
                {this.renderContents()}
            </div>
        );
    }
}

export default withRouter(App);
