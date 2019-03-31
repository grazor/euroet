/*
 *
 * ComponentsPage reducer
 *
 */

import { fromJS } from 'immutable';

import {
  PRODUCT_INFO_FAILURE,
  PRODUCT_INFO_REQUEST,
  PRODUCT_INFO_SUCCESS,
} from './constants';

export const initialState = fromJS({
  product: {},
  components: [],
  isLoading: false,
  isUpdating: false,
});

function componentsPageReducer(state = initialState, action) {
  switch (action.type) {
    case PRODUCT_INFO_REQUEST:
      return state.set('isLoading', true);

    case PRODUCT_INFO_SUCCESS:
      return state
        .set('product', fromJS(action.product))
        .set('components', fromJS(action.components))
        .set('isLoading', false);

    case PRODUCT_INFO_FAILURE:
      return state.set('isLoading', false);

    default:
      return state;
  }
}

export default componentsPageReducer;
