/*
 *
 * ProductsPage reducer
 *
 */

import { fromJS } from 'immutable';

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
  CREATE_REPORT_FAILURE,
  CREATE_REPORT_REQUEST,
  CREATE_REPORT_SUCCESS,
} from './constants';

export const initialState = fromJS({
  project: {},
  products: [],
  reports: [],
  isLoading: false,
  isUpdating: false,
  reportStatus: 'allowed',
});

function productsPageReducer(state = initialState, action) {
  switch (action.type) {
    case PROJECT_INFO_REQUEST:
      return state.set('isLoading', true);
    case PROJECT_INFO_SUCCESS:
      return state
        .set('project', fromJS(action.project))
        .set('products', fromJS(action.products))
        .set('reports', fromJS(action.reports))
        .set('isLoading', false);
    case PROJECT_INFO_FAILURE:
      return state.set('isLoading', false);

    case PRODUCT_CREATE_REQUEST:
    case PRODUCT_UPDATE_REQUEST:
    case PRODUCT_DELETE_REQUEST:
      return state.set('isUpdating', true);
    case PRODUCT_CREATE_FAILURE:
    case PRODUCT_UPDATE_FAILURE:
    case PRODUCT_DELETE_FAILURE:
      return state.set('isUpdating', false);
    case PRODUCT_CREATE_SUCCESS:
      return state
        .set('isUpdating', false)
        .update('products', product =>
          product.insert(0, fromJS(action.product)),
        );

    case PRODUCT_UPDATE_SUCCESS:
      return state
        .set('isUpdating', false)
        .update('products', products =>
          products.map(product =>
            product.get('slug') === action.originalSlug
              ? fromJS(action.product)
              : product,
          ),
        );

    case PRODUCT_DELETE_SUCCESS:
      return state
        .set('isUpdating', false)
        .update('products', products =>
          products.filter(product => product.get('slug') !== action.slug),
        );

    case CREATE_REPORT_REQUEST:
      return state.set('reportStatus', 'pending');

    case CREATE_REPORT_SUCCESS:
      return state
        .set('reportStatus', 'denied')
        .update('reports', reports => reports.insert(0, action.report));

    case CREATE_REPORT_FAILURE:
      return state.set('reportStatus', 'allowed');

    default:
      return state;
  }
}

export default productsPageReducer;
