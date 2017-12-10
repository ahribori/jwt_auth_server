import { combineReducers } from 'redux';
import auth from './Auth';
import application from './Application';

export default combineReducers({
    auth,
    application,
});
