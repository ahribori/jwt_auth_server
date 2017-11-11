import { handleActions } from 'redux-actions';
import { fromJS } from 'immutable';
import helper from './helpers/thunkHelper';

// Action types
const LOGIN = helper.createThunkTypes('auth/LOGIN');
const JOIN = helper.createThunkTypes('auth/JOIN');
const VERIFY = helper.createThunkTypes('auth/VERIFY');
const GET_USER = helper.createThunkTypes('auth/GET_USER');

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

export const verify = token => {
    return helper.createThunk(VERIFY.DEFAULT, {
        url: '/api/auth/verify',
        method: 'get',
        headers: {
            authorization: token,
        }
    })();
};

export const getUser = (_id, token) => {
    return helper.createThunk(GET_USER.DEFAULT, {
        url: '/api/user/' + _id,
        method: 'get',
        headers: {
            authorization: token,
        }
    })();
};

// Initial state
const initialState = fromJS({
    join: null,
    login: null,
    verify: null,
    user: null,
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

    [VERIFY.REQUEST]: (state, action) => {
        return state;
    },
    [VERIFY.SUCCESS]: (state, action) => {
        return state.set('verify', action.payload);
    },
    [VERIFY.FAILURE]: (state, action) => {
        return state.set('verify', action.payload);
    },

    [GET_USER.REQUEST]: (state, action) => {
        return state;
    },
    [GET_USER.SUCCESS]: (state, action) => {
        return state.set('user', action.payload);
    },
    [GET_USER.FAILURE]: (state, action) => {
        return state.set('user', action.payload);
    },

}, initialState);