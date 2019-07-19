/*
 *
 * ComponentsPage reducer
 *
 */

import { fromJS } from 'immutable';

import {
  ADD_COMPONENT_FAILURE,
  ADD_COMPONENT_REQUEST,
  ADD_COMPONENT_SUCCESS,
  ADD_GROUP_FAILURE,
  ADD_GROUP_REQUEST,
  ADD_GROUP_SUCCESS,
  RENAME_GROUP_FAILURE,
  RENAME_GROUP_REQUEST,
  RENAME_GROUP_SUCCESS,
  DELETE_GROUP_FAILURE,
  DELETE_GROUP_REQUEST,
  DELETE_GROUP_SUCCESS,
  BULK_UPDATE_QTY_REQUEST,
  DELETE_COMPONENT_FAILURE,
  DELETE_COMPONENT_REQUEST,
  DELETE_COMPONENT_SUCCESS,
  GET_SUGGESTIONS_FAILURE,
  GET_SUGGESTIONS_REQUEST,
  GET_SUGGESTIONS_SUCCESS,
  PRODUCT_INFO_FAILURE,
  PRODUCT_INFO_REQUEST,
  PRODUCT_INFO_SUCCESS,
  UPDATE_QTY_FAILURE,
  UPDATE_QTY_SUCCESS,
} from './constants';

export const initialState = fromJS({
  product: {},
  components: [],
  query: '',
  suggestions: [],
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

    case BULK_UPDATE_QTY_REQUEST:
      const codes = new Set(action.codes); // eslint-disable-line no-case-declarations
      return state.update('components', components =>
        components.map(component =>
          codes.has(component.getIn(['component', 'code']))
            ? component.set('qty', action.qty).set('aggregated_price', '')
            : component,
        ),
      );

    case UPDATE_QTY_SUCCESS:
      return state.update('components', components =>
        components.map(component =>
          component.getIn(['component', 'code']) ===
          action.component.component.code
            ? fromJS(action.component)
            : component,
        ),
      );

    case GET_SUGGESTIONS_REQUEST:
      if (action.query !== '') {
        return state.set('query', action.query);
      }
      return state.set('query', action.query).set('suggestions', fromJS([]));

    case GET_SUGGESTIONS_SUCCESS:
      return state.set('suggestions', fromJS(action.suggestions));

    case ADD_GROUP_SUCCESS:
      return state.update('components', components =>
        components.push(fromJS({ ...action.group, entries: [] })),
      );

    case RENAME_GROUP_SUCCESS:
      return state.update('components', groups =>
        groups.map(group =>
          group.get('id') === action.group.id
            ? group.set('name', action.group.name)
            : group,
        ),
      );

    case DELETE_GROUP_SUCCESS:
      return state.update('components', groups =>
        groups.filter(group => group.get('id') !== action.id),
      );

    case ADD_COMPONENT_SUCCESS:
      return state.update('components', components =>
        components.insert(0, fromJS(action.component)),
      );

    case DELETE_COMPONENT_REQUEST:
      return state.update('components', components =>
        components.filter(
          component => component.getIn(['component', 'code']) !== action.code,
        ),
      );

    case UPDATE_QTY_FAILURE:
    case GET_SUGGESTIONS_FAILURE:
    case ADD_GROUP_REQUEST:
    case ADD_GROUP_FAILURE:
    case RENAME_GROUP_REQUEST:
    case RENAME_GROUP_FAILURE:
    case DELETE_GROUP_REQUEST:
    case DELETE_GROUP_FAILURE:
    case ADD_COMPONENT_REQUEST:
    case ADD_COMPONENT_FAILURE:
    case DELETE_COMPONENT_FAILURE:
    case DELETE_COMPONENT_SUCCESS:
    default:
      return state;
  }
}

export default componentsPageReducer;
