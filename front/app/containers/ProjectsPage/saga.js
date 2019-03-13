import { call, put, takeLatest } from 'redux-saga/effects';

import fetchJSON from 'utils/fetchjson';

import {
  PROJECTS_REQUEST,
  PROJECTS_SUCCESS,
  PROJECTS_FAILURE,
} from './constants';

function* getProjects() {
  const options = {
    method: 'GET',
  };

  try {
    const projects = yield call(fetchJSON, '/api/projects/', options);
    yield put({ type: PROJECTS_SUCCESS, projects: projects });
  } catch (error) {
    let message;
    switch (error.status) {
      case 500:
        message = 'Internal Server Error';
        break;
      case 401:
        message = 'Invalid credentials';
        break;
      default:
        message = 'Something went wrong';
        yield put({ type: PROJECTS_FAILURE, message: message });
    }
  }
}

function* Saga() {
  yield takeLatest(PROJECTS_REQUEST, getProjects);
}

export default Saga;
