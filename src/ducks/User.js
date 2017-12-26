import { handleActions } from 'redux-actions';
import { fromJS } from 'immutable';
import helper from './helpers/thunkHelper';

// Action types
const JOIN = helper.createThunkTypes('user/JOIN');
const GET_USER = helper.createThunkTypes('user/GET_USER');
const GET_USER_LIST = helper.createThunkTypes('user/GET_USER_LIST');
const MODIFY = helper.createThunkTypes('user/MODIFY');

// Action creators
export const join = (username, password, nickname, email) => helper.createThunk(JOIN.DEFAULT, {
    url: '/api/v1.0/user',
    method: 'post',
    data: {
        username,
        password,
        nickname,
        email,
    },
    headers: {
        authorization: '',
    },
})();

export const getUser = (_id, token) => helper.createThunk(GET_USER.DEFAULT, {
    url: `/api/v1.0/user/${_id}`,
    method: 'get',
    headers: {
        authorization: token,
    },
})();

export const getUserList = token => helper.createThunk(GET_USER_LIST.DEFAULT, {
    url: '/api/v1.0/user/list',
    method: 'get',
    headers: {
        authorization: token,
    },
})();

export const modifyUser = (user, token) => helper.createThunk(MODIFY.DEFAULT, {
    url: `/api/v1.0/user/${user._id}`,
    method: 'put',
    headers: {
        authorization: token,
    },
    data: user,
})();

// Initial state
const initialState = fromJS({
    join: null,
    user: null,
    user_list: null,
    modify: null,
});

// Reducer
export default handleActions({

    [JOIN.REQUEST]: state => state,
    [JOIN.SUCCESS]: (state, action) => state.set('join', action.payload),
    [JOIN.FAILURE]: (state, action) => state.set('join', action.payload),

    [GET_USER.REQUEST]: state => state,
    [GET_USER.SUCCESS]: (state, action) => state.set('user', action.payload),
    [GET_USER.FAILURE]: (state, action) => state.set('user', action.payload),

    [GET_USER_LIST.REQUEST]: state => state,
    [GET_USER_LIST.SUCCESS]: (state, action) => state.set('user_list', action.payload),
    [GET_USER_LIST.FAILURE]: (state, action) => state.set('user_list', action.payload),

    [MODIFY.REQUEST]: state => state,
    [MODIFY.SUCCESS]: (state, action) => state.set('modify', action.payload),
    [MODIFY.FAILURE]: (state, action) => state.set('modify', action.payload),

}, initialState);
