/*
 *
 * ComponentsPage actions
 *
 */

import {
  ADD_COMPONENT_REQUEST,
  BULK_UPDATE_QTY_REQUEST,
  DELETE_COMPONENT_REQUEST,
  GET_SUGGESTIONS_REQUEST,
  PRODUCT_INFO_REQUEST,
} from './constants';

export function fetchProduct(projectSlug, productSlug) {
  return {
    type: PRODUCT_INFO_REQUEST,
    projectSlug,
    productSlug,
  };
}

export function bulkUpdateQty(projectSlug, productSlug, codes, qty) {
  return {
    type: BULK_UPDATE_QTY_REQUEST,
    projectSlug,
    productSlug,
    codes,
    qty,
  };
}

export function getSuggestions(projectSlug, productSlug, query) {
  return {
    type: GET_SUGGESTIONS_REQUEST,
    projectSlug,
    productSlug,
    query,
  };
}

export function addComponent(projectSlug, productSlug, component, qty = 1) {
  return {
    type: ADD_COMPONENT_REQUEST,
    projectSlug,
    productSlug,
    component,
    qty,
  };
}

export function deleteComponent(projectSlug, productSlug, code) {
  return {
    type: DELETE_COMPONENT_REQUEST,
    projectSlug,
    productSlug,
    code,
  };
}
