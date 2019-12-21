import { takeLatest, put, call } from 'redux-saga/effects';

import fetchJSON from 'utils/fetchjson';

import { notifyApiError, notifyError } from 'containers/App/actions';

import {
  LOAD_COMPONENTS_REQUEST,
  LOAD_COMPONENTS_SUCCESS,
  LOAD_COMPONENTS_FAILURE,
} from './constants';

function* loadComponents({ page, filter }) {
  try {
    const components = yield call(
      fetchJSON,
      `/api/components/?page=${page}&q=${filter}`,
      { method: 'GET' },
    );
    yield put({
      type: LOAD_COMPONENTS_SUCCESS,
      components: components.results,
      count: components.count,
      page,
    });
  } catch (error) {
    yield put({ type: LOAD_COMPONENTS_FAILURE });
    if (error.status >= 500) {
      yield put(notifyError('Internal server error'));
    } else {
      yield put(notifyApiError(error.status, error.data));
    }
  }
}

export default function* componentsCatalogSaga() {
  yield takeLatest(LOAD_COMPONENTS_REQUEST, loadComponents);
}
