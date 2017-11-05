import { createAction } from 'redux-actions';
import axios from 'axios';

export default {

    // 비동기 액션 생성
    createThunk: (actionType, axiosOptions) => () => dispatch => {
        const requestAction = createAction(`${actionType}_REQUEST`);
        const successAction = createAction(`${actionType}_SUCCESS`);
        const failureAction = createAction(`${actionType}_FAILURE`);
        dispatch(requestAction());
        return axios(axiosOptions)
            .then(response => {
                dispatch(successAction(response));
            }).catch(error => {
                dispatch(failureAction(error));
            });
    },
    
    createThunkTypes: actionType => {
        return {
            DEFAULT: `${actionType}`,
            REQUEST: `${actionType}_REQUEST`,
            SUCCESS: `${actionType}_SUCCESS`,
            FAILURE: `${actionType}_FAILURE`,
        }
    },

}
