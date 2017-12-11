import { handleActions } from 'redux-actions';
import { fromJS } from 'immutable';
import helper from './helpers/thunkHelper';

// Action types
const FETCH = helper.createThunkTypes('application/FETCH');
const FETCH_LIST = helper.createThunkTypes('application/FETCH_LIST');
const REGISTER = helper.createThunkTypes('application/REGISTER');
const MODIFY = helper.createThunkTypes('application/MODIFY');
const REMOVE = helper.createThunkTypes('application/REMOVE');

// Action creators
export const fetch = (id, token) => helper.createThunk(FETCH.DEFAULT, {
    url: `/api/v1.0/application/${id}`,
    method: 'get',
    headers: {
        authorization: token,
    },
})();

export const fetchList = token => helper.createThunk(FETCH_LIST.DEFAULT, {
    url: '/api/v1.0/application/list',
    method: 'get',
    headers: {
        authorization: token,
    },
})();

export const register = (user, name, origin, callback_url, token) => helper.createThunk(REGISTER.DEFAULT, {
    url: '/api/v1.0/application',
    method: 'post',
    data: {
        user,
        name,
        origin,
        callback_url,
    },
    headers: {
        authorization: token,
    },
})();

export const modify = (id, name, origin, callback_url, token) => helper.createThunk(MODIFY.DEFAULT, {
    url: `/api/v1.0/application/${id}`,
    method: 'PUT',
    data: {
        name,
        origin,
        callback_url,
    },
    headers: {
        authorization: token,
    },
})();

export const remove = (id, token) => helper.createThunk(REMOVE.DEFAULT, {
    url: `/api/v1.0/application/${id}`,
    method: 'delete',
    headers: {
        authorization: token,
    },
})();

// Initial state
const initialState = fromJS({
    fetch: null,
    fetch_list: null,
    register: null,
    modify: null,
    remove: null,
});

// Reducer
export default handleActions({

    [FETCH.REQUEST]: state => state,
    [FETCH.SUCCESS]: (state, action) => state.set('fetch', action.payload),
    [FETCH.FAILURE]: (state, action) => state.set('fetch', action.payload),

    [FETCH_LIST.REQUEST]: state => state,
    [FETCH_LIST.SUCCESS]: (state, action) => state.set('fetch_list', action.payload),
    [FETCH_LIST.FAILURE]: (state, action) => state.set('fetch_list', action.payload),

    [REGISTER.REQUEST]: state => state,
    [REGISTER.SUCCESS]: (state, action) => state.set('register', action.payload),
    [REGISTER.FAILURE]: (state, action) => state.set('register', action.payload),

    [MODIFY.REQUEST]: state => state,
    [MODIFY.SUCCESS]: (state, action) => state.set('modify', action.payload),
    [MODIFY.FAILURE]: (state, action) => state.set('modify', action.payload),

    [REMOVE.REQUEST]: state => state,
    [REMOVE.SUCCESS]: (state, action) => state.set('remove', action.payload),
    [REMOVE.FAILURE]: (state, action) => state.set('remove', action.payload),

}, initialState);
