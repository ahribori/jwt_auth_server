import { combineReducers } from 'redux';
import auth from './Auth';
import user from './User';
import application from './Application';

const appReducer = combineReducers({
    auth,
    user,
    application,
});

const rootReducer = (state, action) => {
    if (action.type === 'auth/LOGOUT') {
        return appReducer(undefined, action);
    }
    return appReducer(state, action);
};

export default rootReducer;
