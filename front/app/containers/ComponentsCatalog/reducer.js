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
      if (
        action.filter === state.get('filter') &&
        action.page === state.get('page') &&
        state.get('components').toJS() !== []
      ) {
        return state;
      }
      return state
        .set('isLoading', true)
        .set('page', 0)
        .set('filter', action.filter)
        .set('count', 0)
        .set('components', fromJS([]));
    case LOAD_COMPONENTS_FAILURE:
      return state.set('isLoading', false);
    case LOAD_COMPONENTS_SUCCESS:
      return state
        .set('isLoading', false)
        .set('components', fromJS(action.components))
        .set('page', action.page)
        .set('count', action.count);
    default:
      return state;
  }
}

export default componentsCatalogReducer;
