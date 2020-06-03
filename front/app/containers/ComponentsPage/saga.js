import fetchJSON from 'utils/fetchjson';
import history from 'utils/history';
import { all, call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { isNull, omitBy } from 'lodash';
import { notifyWarning } from 'containers/App/actions';

import {
  ADD_COMPONENT_BY_CODE_REQUEST,
  ADD_GROUP_WITH_CONTENTS_REQUEST,
  ADD_COMPONENT_FAILURE,
  ADD_COMPONENT_REQUEST,
  ADD_COMPONENT_SUCCESS,
  ADD_GROUP_FAILURE,
  ADD_GROUP_REQUEST,
  ADD_GROUP_SUCCESS,
  BULK_UPDATE_QTY_REQUEST,
  CREATE_REPORT_FAILURE,
  CREATE_REPORT_REQUEST,
  CREATE_REPORT_SUCCESS,
  DELETE_COMPONENT_FAILURE,
  DELETE_COMPONENT_REQUEST,
  DELETE_COMPONENT_SUCCESS,
  DELETE_GROUP_FAILURE,
  DELETE_GROUP_REQUEST,
  DELETE_GROUP_SUCCESS,
  FETCH_GROUP_FAILURE,
  FETCH_GROUP_REQUEST,
  FETCH_GROUP_SUCCESS,
  GET_SUGGESTIONS_FAILURE,
  GET_SUGGESTIONS_REQUEST,
  GET_SUGGESTIONS_SUCCESS,
  NEW_COMPONENT_FAILURE,
  NEW_COMPONENT_REQUEST,
  NEW_COMPONENT_SUCCESS,
  PRODUCT_INFO_FAILURE,
  PRODUCT_INFO_REQUEST,
  PRODUCT_INFO_SUCCESS,
  RENAME_GROUP_FAILURE,
  RENAME_GROUP_REQUEST,
  RENAME_GROUP_SUCCESS,
  UPDATE_CUSTOM_COMPONENT_FAILURE,
  UPDATE_CUSTOM_COMPONENT_REQUEST,
  UPDATE_CUSTOM_COMPONENT_SUCCESS,
  UPDATE_QTY_FAILURE,
  UPDATE_QTY_SUCCESS,
} from './constants';
import { fetchGroup } from './actions';

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
      message = 'Project not found';
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
    const [product, components, reports] = yield all([
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
      call(
        fetchJSON,
        `/api/projects/${projectSlug}/products/${productSlug}/reports/`,
        options,
      ),
    ]);
    yield put({ type: PRODUCT_INFO_SUCCESS, product, components, reports });
  } catch (error) {
    yield handleApiError(error, PRODUCT_INFO_FAILURE);
    if (error.status == 404) {
      history.push('/projects');
    }
  }
}

function* bulkUpdateQty({ projectSlug, productSlug, ids, qty }) {
  const options = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  };

  const baseUrl = `/api/projects/${projectSlug}/products/${productSlug}/components`;
  /* eslint-disable redux-saga/yield-effects */
  const actions = ids.map(id =>
    call(fetchJSON, `${baseUrl}/${id}/`, {
      ...options,
      body: JSON.stringify({ qty }),
    }),
  );
  /* eslint-enable redux-saga/yield-effects */

  const groupsToUpdate = new Set();
  try {
    const result = yield all(actions);
    for (let i = 0; i < result.length; i += 1) {
      yield put({ type: UPDATE_QTY_SUCCESS, entry: result[i] });
      groupsToUpdate.add(result[i].group_id);
    }
  } catch (error) {
    yield handleApiError(error, UPDATE_QTY_FAILURE);
  }

  const it = groupsToUpdate.values();
  let group = it.next();
  while (!group.done) {
    yield put(fetchGroup(projectSlug, productSlug, group.value));
    group = it.next();
  }
}

function* getSuggestions({ query }) {
  const options = {
    method: 'GET',
  };

  const baseUrl = '/api/components';

  if (query.trim() === '') {
    yield put({ type: GET_SUGGESTIONS_SUCCESS, suggestions: [] });
    return;
  }

  try {
    const suggestions = yield call(
      fetchJSON,
      `${baseUrl}/?q=${query}`,
      options,
    );
    yield put({
      type: GET_SUGGESTIONS_SUCCESS,
      suggestions: suggestions.results,
    });
  } catch (error) {
    yield handleApiError(error, GET_SUGGESTIONS_FAILURE);
  }
}

function* addGroup({ projectSlug, productSlug, name }) {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  };
  const baseUrl = `/api/projects/${projectSlug}/products/${productSlug}/groups/`;

  try {
    const added = yield call(fetchJSON, baseUrl, options);
    yield put({ type: ADD_GROUP_SUCCESS, group: added });
  } catch (error) {
    yield handleApiError(error, ADD_GROUP_FAILURE);
  }
}

function* fetchGroupSaga({ projectSlug, productSlug, group }) {
  const options = {
    method: 'GET',
  };
  const baseUrl = `/api/projects/${projectSlug}/products/${productSlug}/groups/${group}/`;

  try {
    const fetched = yield call(fetchJSON, baseUrl, options);
    yield put({ type: FETCH_GROUP_SUCCESS, group: fetched });
  } catch (error) {
    yield handleApiError(error, FETCH_GROUP_FAILURE);
  }
}

function* renameGroup({ projectSlug, productSlug, id, name }) {
  const options = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  };
  const baseUrl = `/api/projects/${projectSlug}/products/${productSlug}/groups/${id}/`;

  try {
    const updated = yield call(fetchJSON, baseUrl, options);
    yield put({ type: RENAME_GROUP_SUCCESS, group: updated });
  } catch (error) {
    yield handleApiError(error, RENAME_GROUP_FAILURE);
  }
}

function* deleteGroup({ projectSlug, productSlug, id }) {
  const options = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  };
  const baseUrl = `/api/projects/${projectSlug}/products/${productSlug}/groups/${id}/`;

  try {
    yield call(fetchJSON, baseUrl, options);
    yield put({ type: DELETE_GROUP_SUCCESS, id });
  } catch (error) {
    yield handleApiError(error, DELETE_GROUP_FAILURE);
  }
}

function* addComponent({ projectSlug, productSlug, group, component, qty }) {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ group, component: component.id, qty }),
  };

  const baseUrl = `/api/projects/${projectSlug}/products/${productSlug}/components/copy/`;

  try {
    const added = yield call(fetchJSON, baseUrl, options);
    yield put({ type: ADD_COMPONENT_SUCCESS, component: added, group });
    yield put(fetchGroup(projectSlug, productSlug, group));
  } catch (error) {
    yield handleApiError(error, ADD_COMPONENT_FAILURE);
  }
}

function* addComponentByCode({
  projectSlug,
  productSlug,
  group,
  code,
  qty,
  collectionName,
}) {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ group, code, qty, collection: collectionName }),
  };

  const baseUrl = `/api/projects/${projectSlug}/products/${productSlug}/components/code/`;

  try {
    const added = yield call(fetchJSON, baseUrl, options);
    yield put({ type: ADD_COMPONENT_SUCCESS, component: added, group });
    yield put(fetchGroup(projectSlug, productSlug, group));
  } catch (error) {
    yield handleApiError(error, ADD_COMPONENT_FAILURE);
  }
}

function* addGroupWithContents({ projectSlug, productSlug, name, items }) {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, items }),
  };

  const baseUrl = `/api/projects/${projectSlug}/products/${productSlug}/components/paste_group/`;

  try {
    const { group, entries } = yield call(fetchJSON, baseUrl, options);
    yield put({ type: ADD_GROUP_SUCCESS, group, entries });
    yield put(fetchGroup(projectSlug, productSlug, group.id));
  } catch (error) {
    yield handleApiError(error, ADD_GROUP_FAILURE);
  }
}

function* newComponent({ projectSlug, productSlug, group, name, qty }) {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ group, name, qty }),
  };

  const baseUrl = `/api/projects/${projectSlug}/products/${productSlug}/components/new/`;

  try {
    const added = yield call(fetchJSON, baseUrl, options);
    yield put({ type: NEW_COMPONENT_SUCCESS, component: added, group });
    yield put(fetchGroup(projectSlug, productSlug, group));
  } catch (error) {
    yield handleApiError(error, NEW_COMPONENT_FAILURE);
  }
}

function* updateCustomComponent({
  projectSlug,
  productSlug,
  group,
  entry,
  data,
}) {
  const options = {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(omitBy(data, isNull)),
  };

  const baseUrl = `/api/projects/${projectSlug}/products/${productSlug}/components/${entry}/`;

  try {
    const updated = yield call(fetchJSON, baseUrl, options);
    yield put({
      type: UPDATE_CUSTOM_COMPONENT_SUCCESS,
      entry: updated,
      group,
    });
    yield put(fetchGroup(projectSlug, productSlug, group));
  } catch (error) {
    yield handleApiError(error, UPDATE_CUSTOM_COMPONENT_FAILURE);
  }
}

function* deleteComponent({ projectSlug, productSlug, group, id }) {
  const options = {
    method: 'DELETE',
  };

  const baseUrl = `/api/projects/${projectSlug}/products/${productSlug}/components`;

  try {
    yield call(fetchJSON, `${baseUrl}/${id}/`, options);
    yield put({ type: DELETE_COMPONENT_SUCCESS, id });
    yield put(fetchGroup(projectSlug, productSlug, group));
  } catch (error) {
    yield handleApiError(error, DELETE_COMPONENT_FAILURE);
  }
}

function* createReport({ projectSlug, productSlug }) {
  const options = {
    method: 'POST',
  };

  const baseUrl = `/api/projects/${projectSlug}/products/${productSlug}/reports/`;

  try {
    const report = yield call(fetchJSON, baseUrl, options);
    yield put({ type: CREATE_REPORT_SUCCESS, report });
  } catch (error) {
    yield handleApiError(error, CREATE_REPORT_FAILURE);
  }
}

export default function* componentsPageSaga() {
  yield takeLatest(PRODUCT_INFO_REQUEST, getProductInfo);
  yield takeLatest(GET_SUGGESTIONS_REQUEST, getSuggestions);

  yield takeEvery(FETCH_GROUP_REQUEST, fetchGroupSaga);
  yield takeLatest(ADD_GROUP_REQUEST, addGroup);
  yield takeLatest(RENAME_GROUP_REQUEST, renameGroup);
  yield takeLatest(DELETE_GROUP_REQUEST, deleteGroup);

  yield takeLatest(ADD_COMPONENT_REQUEST, addComponent);
  yield takeEvery(ADD_COMPONENT_BY_CODE_REQUEST, addComponentByCode);
  yield takeEvery(ADD_GROUP_WITH_CONTENTS_REQUEST, addGroupWithContents);
  yield takeLatest(NEW_COMPONENT_REQUEST, newComponent);
  yield takeLatest(UPDATE_CUSTOM_COMPONENT_REQUEST, updateCustomComponent);
  yield takeLatest(BULK_UPDATE_QTY_REQUEST, bulkUpdateQty);
  yield takeLatest(DELETE_COMPONENT_REQUEST, deleteComponent);

  yield takeLatest(CREATE_REPORT_REQUEST, createReport);
}
