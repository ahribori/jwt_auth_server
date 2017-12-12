import { combineReducers } from 'redux';
import auth from './Auth';
import application from './Application';

const appReducer = combineReducers({
    auth,
    application,
});

const rootReducer = (state, action) => {
    if (action.type === 'auth/LOGOUT') {
        return appReducer(undefined, action);
    }
    return appReducer(state, action);
};

export default rootReducer;
