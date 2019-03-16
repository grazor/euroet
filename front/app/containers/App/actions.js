/*
 *
 * LoginPage actions
 *
 */

import { transform, join } from 'lodash';

import {
  AUTH_REQUEST,
  USER_REQUEST,
  LOGOUT_REQUEST,
  NOTIFY_SUCCESS,
  NOTIFY_WARNING,
  NOTIFY_ERROR,
  NOTIFY_REMOVE,
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
  if (typeof message == 'string') {
    return notifyError(message);
  }
  if (message.non_field_errors != null) {
    return notifyError(message.non_field_errors);
  }
  let errors = transform(
    message,
    (result, value, key) => {
      result.push(`${key}: ${value}`);
    },
    [],
  );
  return notifyError(errors);
}

export function notifyRemove(key) {
  return {
    type: NOTIFY_REMOVE,
    key,
  };
}
