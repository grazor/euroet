import fetchJSON from 'utils/fetchjson';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  notifyApiError,
  notifyError,
  notifySuccess,
  notifyWarning,
} from 'containers/App/actions';

import {
  PRODUCT_CREATE_FAILURE,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_DELETE_FAILURE,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_UPDATE_FAILURE,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PROJECT_INFO_FAILURE,
  PROJECT_INFO_REQUEST,
  PROJECT_INFO_SUCCESS,
} from './constants';

function* getProjectInfo({ slug }) {
  const options = {
    method: 'GET',
  };

  try {
    const project = yield call(fetchJSON, `/api/projects/${slug}/`, options);
    const products = yield call(
      fetchJSON,
      `/api/projects/${slug}/products/`,
      options,
    );
    yield put({ type: PROJECT_INFO_SUCCESS, products, project });
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
        message = 'Project not fount';
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
      yield put(notifyApiError(error.data));
    }
  }
}

function* updateProduct({ type, originalSlug, ...productData }) {
  const options = {
    method: 'PUT',
    body: JSON.stringify(productData),
    headers: { 'Content-Type': 'application/json' },
  };

  try {
    const product = yield call(
      fetchJSON,
      `/api/products/${originalSlug}/`,
      options,
    );
    yield put({ type: PROJECT_UPDATE_SUCCESS, product, originalSlug });
    yield put(notifySuccess('Product has been updated'));
  } catch (error) {
    yield put({ type: PROJECT_UPDATE_FAILURE });
    if (error.status >= 500) {
      yield put(notifyError('Internal server error'));
    } else {
      yield put(notifyApiError(error.data));
    }
  }
}

function* deleteProduct({ slug }) {
  const options = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  };

  try {
    yield call(fetchJSON, `/api/products/${slug}/`, options);
    yield put({ type: PROJECT_DELETE_SUCCESS, slug });
    yield put(notifySuccess('Product has been deleted'));
  } catch (error) {
    yield put({ type: PROJECT_DELETE_FAILURE });
    if (error.status >= 500) {
      yield put(notifyError('Internal server error'));
    } else {
      yield put(notifyApiError(error.data));
    }
  }
}

function* Saga() {
  yield takeLatest(PROJECT_INFO_REQUEST, getProjectInfo);
  yield takeLatest(PRODUCT_CREATE_REQUEST, addProduct);
  yield takeLatest(PRODUCT_UPDATE_REQUEST, updateProduct);
  yield takeLatest(PRODUCT_DELETE_REQUEST, deleteProduct);
}

export default Saga;
