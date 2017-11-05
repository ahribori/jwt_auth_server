import { handleActions } from 'redux-actions';
import { fromJS } from 'immutable';
import helper from './helpers/thunkHelper';

// Action types
const FETCH = helper.createThunkTypes('user/FETCH');

// Action creators
export const fetch = (/* Arguments passed from react component */) => {
	return helper.createThunk(FETCH.DEFAULT, {
		url: '',
		method: '',
		headers: {
			authorization: ''
		}
	})();
};

// Initial state
const initialState = fromJS({
    // TODO define initial state
});

// Reducer
export default handleActions({

    [FETCH.REQUEST]: (state, action) => {
        return state;
    },
    [FETCH.SUCCESS]: (state, action) => {
        return state;
    },
    [FETCH.FAILURE] : (state, action) => {
        return state;
    },

}, initialState);