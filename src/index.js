/**
 * React
 */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

/**
 * Redux
 */
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import reducers from './ducks';


/**
 *  Material-UI
 */
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import * as color from 'material-ui/styles/colors';


const middlewares = [thunk];
const store = createStore(reducers, compose(applyMiddleware(...middlewares)));

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: color.pink500
    }
});

ReactDOM.render(
    <Provider store={store}>
        <MuiThemeProvider muiTheme={muiTheme}>
            <App/>
        </MuiThemeProvider>
    </Provider>,
    document.getElementById('root'));
registerServiceWorker();
