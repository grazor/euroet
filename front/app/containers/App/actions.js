/*
 *
 * LoginPage actions
 *
 */

import { transform } from 'lodash';

import {
  AUTH_REQUEST,
  LOGOUT_REQUEST,
  NOTIFY_ERROR,
  NOTIFY_REMOVE,
  NOTIFY_SUCCESS,
  NOTIFY_WARNING,
  USER_REQUEST,
} from './constants';

export function login(email, password) {
  return {
    type: AUTH_REQUEST,
    email,
    password,
  };
}

export function fetchUser() {
  return {
    type: USER_REQUEST,
  };
}

export function logout() {
  return {
    type: LOGOUT_REQUEST,
  };
}

export function notifySuccess(message) {
  return {
    type: NOTIFY_SUCCESS,
    message,
  };
}

export function notifyWarning(message) {
  return {
    type: NOTIFY_WARNING,
    message,
  };
}

export function notifyError(message) {
  return {
    type: NOTIFY_ERROR,
    message,
  };
}

export function notifyApiError(message) {
  if (typeof message === 'string') {
    return notifyError(message);
  }
  if (message.non_field_errors != null) {
    return notifyError(message.non_field_errors);
  }
  return notifyError(
    transform(
      message,
      (result, value, key) => {
        result.push(`${key}: ${value}`);
      },
      [],
    ),
  );
}

export function notifyRemove(key) {
  return {
    type: NOTIFY_REMOVE,
    key,
  };
}
