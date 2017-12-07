import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    BrowserRouter,
    Link,
} from 'react-router-dom';
import './style/App.scss';
import routes from './routes';

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
                <BrowserRouter>
                    <div>
                        {/* {this._renderMenu()} */}
                        {/* <hr/> */}
                        {this.renderContents()}
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

const mapStateToProps = () => {
    return {};
};

const mapDispatchToProps = () => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
