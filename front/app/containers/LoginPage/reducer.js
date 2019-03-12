/*
 *
 * LoginPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  AUTH_REQUEST,
  AUTH_SUCCESS,
  AUTH_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
} from './constants';

export const initialState = fromJS({
  user: null,
  isAuthenticated: localStorage.getItem('token') != null,
});

function loginPageReducer(state = initialState, action) {
  switch (action.type) {
    case AUTH_REQUEST:
    case AUTH_FAILURE:
    case LOGOUT_REQUEST:
    case LOGOUT_SUCCESS:
      return state.set('user', null).set('isAuthenticated', false);

    case AUTH_SUCCESS:
      return state.set('user', action.user).set('isAuthenticated', true);

    default:
      return state;
  }
}

export default loginPageReducer;