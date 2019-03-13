import { call, put, takeEvery } from 'redux-saga/effects';

import fetchJSON from 'utils/fetchjson';

import {
  AUTH_REQUEST,
  AUTH_SUCCESS,
  AUTH_FAILURE,
  USER_REQUEST,
  USER_SUCCESS,
  USER_FAILURE,
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

function* getUser(action) {
  try {
    const user = yield call(fetchJSON, '/api/users/user/', { method: 'GET' });
    yield put({ type: USER_SUCCESS, user });
  } catch (error) {
    localStorage.removeItem('token');
    yield put({ type: USER_FAILURE });
  }
}

function* logout(action) {
  try {
    yield call(fetchJSON, '/api/users/auth/logout/', { method: 'POST' });
  } finally {
    localStorage.removeItem('token');
    yield put({ type: LOGOUT_SUCCESS });
  }
}

function* authSaga() {
  yield takeEvery(AUTH_REQUEST, authorize);
  yield takeEvery(USER_REQUEST, getUser);
  yield takeEvery(LOGOUT_REQUEST, logout);
}

export default authSaga;
