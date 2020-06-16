import fetchJSON from 'utils/fetchjson';
import history from 'utils/history';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import {
  notifyApiError,
  notifyError,
  notifySuccess,
  notifyWarning,
} from 'containers/App/actions';
import { fetchProject } from './actions';

import {
  CREATE_REPORT_FAILURE,
  CREATE_REPORT_REQUEST,
  CREATE_REPORT_SUCCESS,
  PRODUCT_CREATE_FAILURE,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_DELETE_FAILURE,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_UPDATE_FAILURE,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_COPY_REQUEST,
  PRODUCT_COPY_SUCCESS,
  PRODUCT_COPY_FAILURE,
  PROJECT_INFO_FAILURE,
  PROJECT_INFO_REQUEST,
  PROJECT_INFO_SUCCESS,
  PROJECT_SUGGEST_FAILURE,
  PROJECT_SUGGEST_REQUEST,
  PROJECT_SUGGEST_SUCCESS,
} from './constants';

function* getProjectInfo({ slug }) {
  const options = {
    method: 'GET',
  };

  try {
    const [project, products, reports] = yield all([
      call(fetchJSON, `/api/projects/${slug}/`, options),
      call(fetchJSON, `/api/projects/${slug}/products/`, options),
      call(fetchJSON, `/api/projects/${slug}/reports/`, options),
    ]);
    yield put({ type: PROJECT_INFO_SUCCESS, products, project, reports });
  } catch (error) {
    let message;
    switch (error.status) {
      case 500:
        message = 'Internal Server Error';
        break;
      case 401:
        message = 'Invalid credentials';
        break;
      case 404:
        message = 'Project not found';
        history.push('/projects');
        break;
      default:
        message = 'Something went wrong';
    }
    yield put({ type: PROJECT_INFO_FAILURE });
    yield put(notifyWarning(message));
  }
}

function* addProduct({ type, projectSlug, ...productData }) {
  const options = {
    method: 'POST',
    body: JSON.stringify(productData),
    headers: { 'Content-Type': 'application/json' },
  };

  try {
    const product = yield call(
      fetchJSON,
      `/api/projects/${projectSlug}/products/`,
      options,
    );
    yield put({ type: PRODUCT_CREATE_SUCCESS, product });
    yield put(notifySuccess('Product has been created'));
  } catch (error) {
    yield put({ type: PRODUCT_CREATE_FAILURE });
    if (error.status >= 500) {
      yield put(notifyError('Internal server error'));
    } else {
      yield put(notifyApiError(error.status, error.data));
    }
  }
}

function* updateProduct({ type, projectSlug, originalSlug, ...productData }) {
  const options = {
    method: 'PUT',
    body: JSON.stringify(productData),
    headers: { 'Content-Type': 'application/json' },
  };

  try {
    const product = yield call(
      fetchJSON,
      `/api/projects/${projectSlug}/products/${originalSlug}/`,
      options,
    );
    yield put({ type: PRODUCT_UPDATE_SUCCESS, product, originalSlug });
    yield put(notifySuccess('Product has been updated'));
  } catch (error) {
    yield put({ type: PRODUCT_UPDATE_FAILURE });
    if (error.status >= 500) {
      yield put(notifyError('Internal server error'));
    } else {
      yield put(notifyApiError(error.status, error.data));
    }
  }
}

function* deleteProduct({ projectSlug, slug }) {
  const options = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  };

  try {
    yield call(
      fetchJSON,
      `/api/projects/${projectSlug}/products/${slug}/`,
      options,
    );
    yield put({ type: PRODUCT_DELETE_SUCCESS, slug });
    yield put(notifySuccess('Product has been deleted'));
  } catch (error) {
    yield put({ type: PRODUCT_DELETE_FAILURE });
    if (error.status >= 500) {
      yield put(notifyError('Internal server error'));
    } else {
      yield put(notifyApiError(error.status, error.data));
    }
  }
}

function* createReport({ projectSlug }) {
  const options = {
    method: 'POST',
  };

  const baseUrl = `/api/projects/${projectSlug}/reports/`;

  try {
    const report = yield call(fetchJSON, baseUrl, options);
    yield put({ type: CREATE_REPORT_SUCCESS, report });
  } catch (error) {
    yield put({ type: CREATE_REPORT_FAILURE });
    if (error.status >= 500) {
      yield put(notifyError('Internal server error'));
    } else {
      yield put(notifyApiError(error.status, error.data));
    }
  }
}

function* copyProduct({ projectSlug, productSlug, targetSlug, copySlug }) {
  const options = {
    method: 'POST',
    body: JSON.stringify({
      target_project_slug: targetSlug,
      copy_slug: copySlug,
    }),
    headers: { 'Content-Type': 'application/json' },
  };

  try {
    const product = yield call(
      fetchJSON,
      `/api/projects/${projectSlug}/products/${productSlug}/copy/`,
      options,
    );
    yield put({ type: PRODUCT_COPY_SUCCESS, product, targetSlug });
    yield put(notifySuccess('Product has been copied'));
  } catch (error) {
    yield put({ type: PRODUCT_COPY_FAILURE });
    if (error.status >= 500) {
      yield put(notifyError('Internal server error'));
    } else {
      yield put(notifyApiError(error.status, error.data));
    }
  }
}

function* getProjectSuggest() {
  const options = {
    method: 'GET',
  };

  try {
    const projects = yield call(fetchJSON, '/api/projects/', options);
    yield put({ type: PROJECT_SUGGEST_SUCCESS, projects });
  } catch (error) {
    yield put({ type: PROJECT_SUGGEST_FAILURE });
    yield put(notifyWarning('Failed to fetch suggest'));
  }
}

function* Saga() {
  yield takeLatest(PROJECT_INFO_REQUEST, getProjectInfo);
  yield takeLatest(PROJECT_SUGGEST_REQUEST, getProjectSuggest);
  yield takeLatest(PRODUCT_CREATE_REQUEST, addProduct);
  yield takeLatest(PRODUCT_UPDATE_REQUEST, updateProduct);
  yield takeLatest(PRODUCT_DELETE_REQUEST, deleteProduct);
  yield takeLatest(PRODUCT_COPY_REQUEST, copyProduct);

  yield takeLatest(CREATE_REPORT_REQUEST, createReport);
}

export default Saga;
