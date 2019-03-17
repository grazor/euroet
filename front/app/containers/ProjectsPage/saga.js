import fetchJSON from 'utils/fetchjson';
import { call, put, takeLatest } from 'redux-saga/effects';
import { notifyWarning } from 'containers/App/actions';

import {
  PROJECTS_FAILURE,
  PROJECTS_REQUEST,
  PROJECTS_SUCCESS,
} from './constants';

function* getProjects() {
  const options = {
    method: 'GET',
  };

  try {
    const projects = yield call(fetchJSON, '/api/projects/', options);
    yield put({ type: PROJECTS_SUCCESS, projects });
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
    }
    yield put({ type: PROJECTS_FAILURE });
    yield put(notifyWarning(message));
  }
}

function* Saga() {
  yield takeLatest(PROJECTS_REQUEST, getProjects);
}

export default Saga;
