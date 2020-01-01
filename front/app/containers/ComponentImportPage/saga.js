import { takeLatest, call, put } from 'redux-saga/effects';

import fetchJSON from 'utils/fetchjson';

import { notifyApiError, notifyError } from 'containers/App/actions';

import {
  IMPORTS_REQUEST,
  IMPORTS_SUCCESS,
  IMPORTS_FAILURE,
  IMPORT_FILE_REQUEST,
  IMPORT_FILE_SUCCESS,
  IMPORT_FILE_FAILURE,
} from './constants';

function* loadImports() {
  try {
    const imports = yield call(fetchJSON, '/api/import/', { method: 'GET' });
    yield put({
      type: IMPORTS_SUCCESS,
      imports: imports.results,
    });
  } catch (error) {
    yield put({ type: IMPORTS_FAILURE });
    if (error.status >= 500) {
      yield put(notifyError('Internal server error'));
    } else {
      yield put(notifyApiError(error.status, error.data));
    }
  }
}

function* importFile({ file }) {
  try {
    const formData = new FormData();
    formData.append('data', file);
    const data = yield call(fetchJSON, '/api/import/', {
      method: 'POST',
      body: formData,
    });
    yield put({
      type: IMPORT_FILE_SUCCESS,
      data,
    });
  } catch (error) {
    yield put({ type: IMPORT_FILE_FAILURE });
    if (error.status >= 500) {
      yield put(notifyError('Internal server error'));
    } else {
      yield put(notifyApiError(error.status, error.data));
    }
  }
}

export default function* componentImportPageSaga() {
  yield takeLatest(IMPORTS_REQUEST, loadImports);
  yield takeLatest(IMPORT_FILE_REQUEST, importFile);
}
