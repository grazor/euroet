import fetchJSON from 'utils/fetchjson';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  notifyApiError,
  notifyError,
  notifySuccess,
  notifyWarning,
} from 'containers/App/actions';

import {
  PROJECTS_FAILURE,
  PROJECTS_REQUEST,
  PROJECTS_SUCCESS,
  PROJECT_CREATE_FAILURE,
  PROJECT_CREATE_REQUEST,
  PROJECT_CREATE_SUCCESS,
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

function* addProject({ type, ...projectData }) {
  const options = {
    method: 'POST',
    body: JSON.stringify(projectData),
    headers: { 'Content-Type': 'application/json' },
  };

  try {
    const project = yield call(fetchJSON, '/api/projects/', options);
    yield put({ type: PROJECT_CREATE_SUCCESS, project });
    yield put(notifySuccess('Project has been created'));
  } catch (error) {
    yield put({ type: PROJECT_CREATE_FAILURE });
    if (error.status >= 500) {
      yield put(notifyError('Internal server error'));
    } else {
      yield put(notifyApiError(error.data));
    }
  }
}

function* Saga() {
  yield takeLatest(PROJECTS_REQUEST, getProjects);
  yield takeLatest(PROJECT_CREATE_REQUEST, addProject);
}

export default Saga;
