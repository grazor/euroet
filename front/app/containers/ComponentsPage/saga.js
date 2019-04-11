import fetchJSON from 'utils/fetchjson';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { notifyWarning } from 'containers/App/actions';

import {
  ADD_COMPONENT_FAILURE,
  ADD_COMPONENT_REQUEST,
  ADD_COMPONENT_SUCCESS,
  BULK_UPDATE_QTY_REQUEST,
  DELETE_COMPONENT_FAILURE,
  DELETE_COMPONENT_REQUEST,
  DELETE_COMPONENT_SUCCESS,
  GET_SUGGESTIONS_FAILURE,
  GET_SUGGESTIONS_REQUEST,
  GET_SUGGESTIONS_SUCCESS,
  PRODUCT_INFO_FAILURE,
  PRODUCT_INFO_REQUEST,
  PRODUCT_INFO_SUCCESS,
  UPDATE_QTY_FAILURE,
  UPDATE_QTY_SUCCESS,
} from './constants';

function* handleApiError(error, action) {
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
  yield put({ type: action });
  yield put(notifyWarning(message));
}

function* getProductInfo({ projectSlug, productSlug }) {
  const options = {
    method: 'GET',
  };

  try {
    const [product, components] = yield all([
      call(
        fetchJSON,
        `/api/projects/${projectSlug}/products/${productSlug}`,
        options,
      ),
      call(
        fetchJSON,
        `/api/projects/${projectSlug}/products/${productSlug}/components/`,
        options,
      ),
    ]);
    yield put({ type: PRODUCT_INFO_SUCCESS, product, components });
  } catch (error) {
    yield handleApiError(error, PRODUCT_INFO_FAILURE);
  }
}

function* bulkUpdateQty({ projectSlug, productSlug, codes, qty }) {
  const options = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  };

  const baseUrl = `/api/projects/${projectSlug}/products/${productSlug}/components`;
  /* eslint-disable redux-saga/yield-effects */
  const actions = codes.map(code =>
    call(fetchJSON, `${baseUrl}/${code}/`, {
      ...options,
      body: JSON.stringify({ qty }),
    }),
  );
  /* eslint-enable redux-saga/yield-effects */

  try {
    const result = yield all(actions);
    for (let i = 0; i < result.length; i += 1) {
      yield put({ type: UPDATE_QTY_SUCCESS, component: result[i] });
    }
  } catch (error) {
    yield handleApiError(error, UPDATE_QTY_FAILURE);
  }
}

function* getSuggestions({ projectSlug, productSlug, query }) {
  const options = {
    method: 'GET',
  };

  const baseUrl = `/api/projects/${projectSlug}/products/${productSlug}/components/find`;

  try {
    const suggestions = yield call(
      fetchJSON,
      `${baseUrl}/?q=${query}`,
      options,
    );
    yield put({ type: GET_SUGGESTIONS_SUCCESS, suggestions });
  } catch (error) {
    yield handleApiError(error, GET_SUGGESTIONS_FAILURE);
  }
}

function* addComponent({ projectSlug, productSlug, component, qty }) {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ component: component.id, qty }),
  };

  const baseUrl = `/api/projects/${projectSlug}/products/${productSlug}/components/`;

  try {
    const added = yield call(fetchJSON, baseUrl, options);
    yield put({ type: ADD_COMPONENT_SUCCESS, component: added });
  } catch (error) {
    yield handleApiError(error, ADD_COMPONENT_FAILURE);
  }
}

function* deleteComponent({ projectSlug, productSlug, code }) {
  const options = {
    method: 'DELETE',
  };

  const baseUrl = `/api/projects/${projectSlug}/products/${productSlug}/components`;

  try {
    const component = yield call(fetchJSON, `${baseUrl}/${code}/`, options);
    yield put({ type: DELETE_COMPONENT_SUCCESS, component });
  } catch (error) {
    yield handleApiError(error, DELETE_COMPONENT_FAILURE);
  }
}

export default function* componentsPageSaga() {
  yield takeLatest(PRODUCT_INFO_REQUEST, getProductInfo);
  yield takeLatest(BULK_UPDATE_QTY_REQUEST, bulkUpdateQty);
  yield takeLatest(GET_SUGGESTIONS_REQUEST, getSuggestions);
  yield takeLatest(ADD_COMPONENT_REQUEST, addComponent);
  yield takeLatest(DELETE_COMPONENT_REQUEST, deleteComponent);
}
