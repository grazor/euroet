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
  PROJECT_DELETE_FAILURE,
  PROJECT_DELETE_REQUEST,
  PROJECT_DELETE_SUCCESS,
  PROJECT_TOGGLE_STAR_FAILURE,
  PROJECT_TOGGLE_STAR_REQUEST,
  PROJECT_TOGGLE_STAR_SUCCESS,
  PROJECT_UPDATE_FAILURE,
  PROJECT_UPDATE_REQUEST,
  PROJECT_UPDATE_SUCCESS,
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

function* updateProject({ type, originalSlug, ...projectData }) {
  const options = {
    method: 'PUT',
    body: JSON.stringify(projectData),
    headers: { 'Content-Type': 'application/json' },
  };

  try {
    const project = yield call(
      fetchJSON,
      `/api/projects/${originalSlug}/`,
      options,
    );
    yield put({ type: PROJECT_UPDATE_SUCCESS, project, originalSlug });
    yield put(notifySuccess('Project has been updated'));
  } catch (error) {
    yield put({ type: PROJECT_UPDATE_FAILURE });
    if (error.status >= 500) {
      yield put(notifyError('Internal server error'));
    } else {
      yield put(notifyApiError(error.data));
    }
  }
}

function* deleteProject({ slug }) {
  const options = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  };

  try {
    yield call(fetchJSON, `/api/projects/${slug}/`, options);
    yield put({ type: PROJECT_DELETE_SUCCESS, slug });
    yield put(notifySuccess('Project has been deleted'));
  } catch (error) {
    yield put({ type: PROJECT_DELETE_FAILURE });
    if (error.status >= 500) {
      yield put(notifyError('Internal server error'));
    } else {
      yield put(notifyApiError(error.data));
    }
  }
}

function* toggleStar({ slug, isSet }) {
  const options = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };

  try {
    if (isSet) {
      yield call(fetchJSON, `/api/projects/${slug}/star`, options);
      yield put(notifySuccess('Project has been starred'));
    } else {
      yield call(fetchJSON, `/api/projects/${slug}/unstar`, options);
      yield put(notifySuccess('Project has been unstarred'));
    }
    yield put({ type: PROJECT_TOGGLE_STAR_SUCCESS, slug, isSet });
  } catch (error) {
    yield put({ type: PROJECT_TOGGLE_STAR_FAILURE });
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
  yield takeLatest(PROJECT_UPDATE_REQUEST, updateProject);
  yield takeLatest(PROJECT_DELETE_REQUEST, deleteProject);
  yield takeLatest(PROJECT_TOGGLE_STAR_REQUEST, toggleStar);
}

export default Saga;
