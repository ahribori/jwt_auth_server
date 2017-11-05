import React, { Component } from 'react';
import { connect } from 'react-redux';
import './style/App.scss';
import {
    BrowserRouter,
    Link
} from 'react-router-dom';
import routes from './routes';

class App extends Component {

    constructor(props) {
        super(props);
        this._renderMenu = this._renderMenu.bind(this);
        this._renderContents = this._renderContents.bind(this);
    }

    _renderMenu() {
        return (
            <div>
                <ul>
                    <li><Link to="/home">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                </ul>
            </div>
        )
    }

    _renderContents() {
        return (
            <div>
                {routes}
            </div>
        )
    }

    render() {
        return (
            <div className="App">
                <BrowserRouter>
                    <div>
                        {this._renderMenu()}
                        <hr/>
                        {this._renderContents()}
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);