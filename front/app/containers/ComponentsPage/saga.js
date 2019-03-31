import fetchJSON from 'utils/fetchjson';
import { call, put, takeLatest } from 'redux-saga/effects';
import { notifyWarning } from 'containers/App/actions';

import {
  PRODUCT_INFO_FAILURE,
  PRODUCT_INFO_REQUEST,
  PRODUCT_INFO_SUCCESS,
} from './constants';

function* getProductInfo({ projectSlug, productSlug }) {
  const options = {
    method: 'GET',
  };

  try {
    const product = yield call(
      fetchJSON,
      `/api/projects/${projectSlug}/products/${productSlug}`,
      options,
    );
    const components = yield call(
      fetchJSON,
      `/api/projects/${projectSlug}/products/${productSlug}/components/`,
      options,
    );
    yield put({ type: PRODUCT_INFO_SUCCESS, product, components });
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
    yield put({ type: PRODUCT_INFO_FAILURE });
    yield put(notifyWarning(message));
  }
}

export default function* componentsPageSaga() {
  yield takeLatest(PRODUCT_INFO_REQUEST, getProductInfo);
}
