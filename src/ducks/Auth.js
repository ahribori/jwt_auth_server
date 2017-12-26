import { handleActions } from 'redux-actions';
import { fromJS } from 'immutable';
import helper from './helpers/thunkHelper';

// Action types
const LOGIN = helper.createThunkTypes('auth/LOGIN');
const VERIFY = helper.createThunkTypes('auth/VERIFY');
const REFRESH = helper.createThunkTypes('auth/REFRESH');
const LOGOUT = 'auth/LOGOUT';

// Action creators
export const login = (username, password) => helper.createThunk(LOGIN.DEFAULT, {
    url: '/api/v1.0/auth/login',
    method: 'post',
    data: {
        username,
        password,
    },
    headers: {
        authorization: '',
    },
})();

export const verify = token => helper.createThunk(VERIFY.DEFAULT, {
    url: '/api/v1.0/auth/verify',
    method: 'get',
    headers: {
        authorization: token,
    },
})();

export const refresh = token => helper.createThunk(REFRESH.DEFAULT, {
    url: '/api/v1.0/auth/refresh',
    method: 'get',
    headers: {
        authorization: token,
    },
})();

export const logout = () => {
    return {
        type: LOGOUT,
    };
};

// Initial state
const initialState = fromJS({
    login: null,
    verify: null,
    refresh: null,
});

// Reducer
export default handleActions({

    [LOGIN.REQUEST]: state => state,
    [LOGIN.SUCCESS]: (state, action) => state.set('login', action.payload),
    [LOGIN.FAILURE]: (state, action) => state.set('login', action.payload),

    [VERIFY.REQUEST]: state => state,
    [VERIFY.SUCCESS]: (state, action) => state.set('verify', action.payload),
    [VERIFY.FAILURE]: (state, action) => state.set('verify', action.payload),

    [REFRESH.REQUEST]: state => state,
    [REFRESH.SUCCESS]: (state, action) => state.set('refresh', action.payload),
    [REFRESH.FAILURE]: (state, action) => state.set('refresh', action.payload),

    [LOGOUT]: state => state,

}, initialState);
