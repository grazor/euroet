/*
 *
 * ComponentsCatalog reducer
 *
 */

import { fromJS } from 'immutable';
import {
  LOAD_COMPONENTS_REQUEST,
  LOAD_COMPONENTS_FAILURE,
  LOAD_COMPONENTS_SUCCESS,
} from './constants';

export const initialState = fromJS({
  components: [],
  page: 1,
  count: 0,
  filter: '',
  isLoading: false,
});

function componentsCatalogReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_COMPONENTS_REQUEST:
      return state
        .set('isLoading', true)
        .set('page', action.page)
        .set('filter', action.filter);
    case LOAD_COMPONENTS_FAILURE:
      return state.set('isLoading', false);
    case LOAD_COMPONENTS_SUCCESS:
      return state
        .set('isLoading', false)
        .set('components', fromJS(action.components))
        .set('count', action.count);
    default:
      return state;
  }
}

export default componentsCatalogReducer;
