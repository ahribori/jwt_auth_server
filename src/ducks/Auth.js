import { handleActions } from 'redux-actions';
import { fromJS } from 'immutable';
import helper from './helpers/thunkHelper';

// Action types
const LOGIN = helper.createThunkTypes('user/LOGIN');
const JOIN = helper.createThunkTypes('user/JOIN');

// Action creators
export const login = (username, password) => {
    return helper.createThunk(LOGIN.DEFAULT, {
        url: '/api/auth/login',
        method: 'post',
        data: {
            username,
            password,
        },
        headers: {
            authorization: ''
        }
    })();
};

export const join = (username, password, nickname, email) => {
    return helper.createThunk(JOIN.DEFAULT, {
        url: '/api/user',
        method: 'post',
        data: {
            username,
            password,
            nickname,
            email,
        },
		headers: {
			authorization: ''
		}
	})();
};

// Initial state
const initialState = fromJS({
    join: null,
    login: null,
});

// Reducer
export default handleActions({

    [LOGIN.REQUEST]: (state, action) => {
        return state;
    },
    [LOGIN.SUCCESS]: (state, action) => {
        return state.set('login', action.payload);
    },
    [LOGIN.FAILURE]: (state, action) => {
        return state.set('login', action.payload);
    },

    [JOIN.REQUEST]: (state, action) => {
        return state;
    },
    [JOIN.SUCCESS]: (state, action) => {
        return state.set('join', action.payload);
    },
    [JOIN.FAILURE]: (state, action) => {
        return state.set('join', action.payload);
    },

}, initialState);