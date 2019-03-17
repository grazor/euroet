/*
 *
 * LoginPage reducer
 *
 */

import { fromJS } from 'immutable';
import { map } from 'lodash';

import {
  AUTH_FAILURE,
  AUTH_REQUEST,
  AUTH_SUCCESS,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  NOTIFY_ERROR,
  NOTIFY_REMOVE,
  NOTIFY_SUCCESS,
  NOTIFY_WARNING,
  USER_FAILURE,
  USER_REQUEST,
  USER_SUCCESS,
} from './constants';

export const initialState = fromJS({
  user: null,
  isAuthenticated: localStorage.getItem('token') != null,
  notifications: [],
});

let NOTIFICATION_KEY = 0;

const NOTIFICATION_VARIANTS = {
  [NOTIFY_SUCCESS]: 'success',
  [NOTIFY_WARNING]: 'warning',
  [NOTIFY_ERROR]: 'error',
};

function buildNotifications(message, type) {
  let messages = message;
  if (typeof message === 'string') {
    messages = [message];
  }
  return map(messages, body => ({
    key: NOTIFICATION_KEY++, // eslint-disable-line no-plusplus
    message: body,
    options: {
      variant: NOTIFICATION_VARIANTS[type],
    },
  }));
}

function loginPageReducer(state = initialState, action) {
  switch (action.type) {
    case AUTH_REQUEST:
    case AUTH_FAILURE:
    case USER_FAILURE:
    case LOGOUT_REQUEST:
    case LOGOUT_SUCCESS:
      return state.set('user', null).set('isAuthenticated', false);

    case AUTH_SUCCESS:
    case USER_SUCCESS:
      return state.set('user', action.user).set('isAuthenticated', true);

    case USER_REQUEST:
      return state;

    case NOTIFY_SUCCESS:
    case NOTIFY_WARNING:
    case NOTIFY_ERROR:
      return state.update('notifications', notifications =>
        notifications.concat(buildNotifications(action.message, action.type)),
      );

    case NOTIFY_REMOVE:
      return state.update('notifications', notifications =>
        notifications.filter(item => item.key !== action.key),
      );

    default:
      return state;
  }
}

export default loginPageReducer;
