/*
 *
 * LoginPage actions
 *
 */

import { AUTH_REQUEST, USER_REQUEST, LOGOUT_REQUEST } from './constants';

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
