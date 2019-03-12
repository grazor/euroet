/*
 *
 * LoginPage actions
 *
 */

import { AUTH_REQUEST, LOGOUT_REQUEST } from './constants';

export function login(email, password) {
  return {
    type: AUTH_REQUEST,
    email,
    password,
  };
}

export function logout() {
  return {
    type: LOGOUT_REQUEST,
  };
}
