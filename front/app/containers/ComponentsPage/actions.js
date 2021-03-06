/*
 *
 * ComponentsPage actions
 *
 */

import {
  ADD_COMPONENT_BY_CODE_REQUEST,
  ADD_GROUP_WITH_CONTENTS_REQUEST,
  ADD_COMPONENT_REQUEST,
  ADD_GROUP_REQUEST,
  BULK_UPDATE_QTY_REQUEST,
  CREATE_REPORT_REQUEST,
  DELETE_COMPONENT_REQUEST,
  DELETE_GROUP_REQUEST,
  FETCH_GROUP_REQUEST,
  GET_SUGGESTIONS_REQUEST,
  NEW_COMPONENT_REQUEST,
  PRODUCT_INFO_REQUEST,
  RENAME_GROUP_REQUEST,
  UPDATE_CUSTOM_COMPONENT_REQUEST,
} from './constants';

export function fetchProduct(projectSlug, productSlug) {
  return {
    type: PRODUCT_INFO_REQUEST,
    projectSlug,
    productSlug,
  };
}

export function bulkUpdateQty(projectSlug, productSlug, ids, qty) {
  return {
    type: BULK_UPDATE_QTY_REQUEST,
    projectSlug,
    productSlug,
    ids,
    qty,
  };
}

export function getSuggestions(query) {
  return {
    type: GET_SUGGESTIONS_REQUEST,
    query,
  };
}

export function addGroup(projectSlug, productSlug, name) {
  return {
    type: ADD_GROUP_REQUEST,
    projectSlug,
    productSlug,
    name,
  };
}

export function fetchGroup(projectSlug, productSlug, group) {
  return {
    type: FETCH_GROUP_REQUEST,
    projectSlug,
    productSlug,
    group,
  };
}

export function renameGroup(projectSlug, productSlug, id, name) {
  return {
    type: RENAME_GROUP_REQUEST,
    projectSlug,
    productSlug,
    id,
    name,
  };
}

export function deleteGroup(projectSlug, productSlug, id) {
  return {
    type: DELETE_GROUP_REQUEST,
    projectSlug,
    productSlug,
    id,
  };
}

export function addComponent(
  projectSlug,
  productSlug,
  groupId,
  component,
  qty = 1,
) {
  return {
    type: ADD_COMPONENT_REQUEST,
    projectSlug,
    productSlug,
    group: groupId,
    component,
    qty,
  };
}

export function addComponentByCode(
  projectSlug,
  productSlug,
  groupId,
  code,
  qty = 1,
  collectionName = '',
) {
  return {
    type: ADD_COMPONENT_BY_CODE_REQUEST,
    projectSlug,
    productSlug,
    group: groupId,
    code,
    qty,
    collectionName,
  };
}

export function addGroupWithContents(projectSlug, productSlug, name, items) {
  return {
    type: ADD_GROUP_WITH_CONTENTS_REQUEST,
    projectSlug,
    productSlug,
    name,
    items,
  };
}

export function newComponent(projectSlug, productSlug, groupId, name, qty = 1) {
  return {
    type: NEW_COMPONENT_REQUEST,
    projectSlug,
    productSlug,
    group: groupId,
    name,
    qty,
  };
}

export function updateCustomComponent(
  projectSlug,
  productSlug,
  groupId,
  entryId,
  name = null,
  price = null,
) {
  return {
    type: UPDATE_CUSTOM_COMPONENT_REQUEST,
    projectSlug,
    productSlug,
    group: groupId,
    entry: entryId,
    data: { name, price },
  };
}

export function deleteComponent(projectSlug, productSlug, group, id) {
  return {
    type: DELETE_COMPONENT_REQUEST,
    projectSlug,
    productSlug,
    group,
    id,
  };
}

export function createReport(projectSlug, productSlug) {
  return {
    type: CREATE_REPORT_REQUEST,
    projectSlug,
    productSlug,
  };
}
