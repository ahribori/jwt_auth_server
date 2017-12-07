/**
 * React
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {
    BrowserRouter as Router,
} from 'react-router-dom';

/**
 *  Material-UI
 */
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import * as color from 'material-ui/styles/colors';

/**
 * Redux
 */
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from './ducks';

import App from './App';
import registerServiceWorker from './registerServiceWorker';


const middlewares = [thunk];
const store = createStore(reducers, compose(applyMiddleware(...middlewares)));

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: color.pink500,
    },
});

ReactDOM.render(
    <Provider store={store}>
        <MuiThemeProvider muiTheme={muiTheme}>
            <Router>
                <App />
            </Router>
        </MuiThemeProvider>
    </Provider>,
    document.getElementById('root'),
);
registerServiceWorker();
