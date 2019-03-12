import { call, put, takeLatest } from 'redux-saga/effects';

import fetchJSON from 'utils/fetchjson';

import {
  AUTH_REQUEST,
  AUTH_SUCCESS,
  AUTH_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
} from './constants';

function* authorize({ email: username, password }) {
  localStorage.removeItem('token');
  const options = {
    body: JSON.stringify({ username, password }),
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  };

  try {
    const { user, token } = yield call(
      fetchJSON,
      '/api/users/auth/login/',
      options,
    );
    localStorage.setItem('token', token);
    yield put({ type: AUTH_SUCCESS, user });
  } catch (error) {
    let message;
    if (error.status >= 500) message = 'Server error';
    else message = error.json();
    localStorage.removeItem('token');
    yield put({ type: AUTH_FAILURE, error: message });
  }
}

function* logout() {
  yield call(fetchJSON, '/api/users/auth/logout/', { method: 'POST' });
  localStorage.removeItem('token');
  yield put({ type: LOGOUT_SUCCESS, payload: token });
}

function* authSaga() {
  yield takeLatest(AUTH_REQUEST, authorize);
  yield takeLatest(LOGOUT_REQUEST, logout);
}

export default authSaga;
