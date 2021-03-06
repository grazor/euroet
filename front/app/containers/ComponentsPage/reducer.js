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

export const initialState = fromJS({
  product: {},
  components: [],
  reports: [],
  query: '',
  suggestions: [],
  isLoading: false,
  isUpdating: false,
  reportStatus: 'allowed',
});

function componentsPageReducer(state = initialState, action) {
  switch (action.type) {
    case PRODUCT_INFO_REQUEST:
      return state.set('isLoading', true);

    case PRODUCT_INFO_SUCCESS:
      return state
        .set('product', fromJS(action.product))
        .set('components', fromJS(action.components))
        .set('reports', fromJS(action.reports))
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
    case UPDATE_CUSTOM_COMPONENT_SUCCESS:
      return state.update('components', groups =>
        groups.map(group =>
          group.update('entries', entries =>
            entries.map(entry =>
              entry.get('id') === action.entry.id
                ? fromJS(action.entry)
                : entry,
            ),
          ),
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
        components.push(
          fromJS({ ...action.group, entries: action.entries || [] }),
        ),
      );

    case RENAME_GROUP_SUCCESS:
      return state.update('components', groups =>
        groups.map(group =>
          group.get('id') === action.group.id
            ? group.set('name', action.group.name)
            : group,
        ),
      );

    case FETCH_GROUP_REQUEST:
      return state.update('components', groups =>
        groups.map(group =>
          group.get('id') === action.group
            ? group.set('total_price', '')
            : group,
        ),
      );

    case FETCH_GROUP_SUCCESS:
      return state.update('components', groups =>
        groups.map(group =>
          group.get('id') === action.group.id
            ? group.set('total_price', action.group.total_price)
            : group,
        ),
      );

    case DELETE_GROUP_SUCCESS:
      return state.update('components', groups =>
        groups.filter(group => group.get('id') !== action.id),
      );

    case ADD_COMPONENT_SUCCESS:
    case NEW_COMPONENT_SUCCESS:
      return state.update('components', groups =>
        groups.map(group =>
          group.get('id') === action.group
            ? group.update('entries', entries =>
                entries.push(fromJS(action.component)),
              )
            : group,
        ),
      );

    case DELETE_COMPONENT_REQUEST:
      return state.update('components', groups =>
        groups.map(group =>
          group.get('id') === action.group
            ? group.update('entries', entries =>
                entries.filter(entry => entry.get('id') !== action.id),
              )
            : group,
        ),
      );

      return state.update('components', components =>
        components.filter(
          component => component.getIn(['component', 'code']) !== action.code,
        ),
      );

    case CREATE_REPORT_REQUEST:
      return state.set('reportStatus', 'pending');

    case CREATE_REPORT_SUCCESS:
      return state
        .set('reportStatus', 'denied')
        .update('reports', reports => reports.insert(0, action.report));

    case CREATE_REPORT_FAILURE:
      return state.set('reportStatus', 'allowed');

    case UPDATE_QTY_FAILURE:
    case GET_SUGGESTIONS_FAILURE:
    case ADD_GROUP_REQUEST:
    case ADD_GROUP_FAILURE:
    case RENAME_GROUP_REQUEST:
    case RENAME_GROUP_FAILURE:
    case UPDATE_CUSTOM_COMPONENT_REQUEST:
    case UPDATE_CUSTOM_COMPONENT_FAILURE:
    case FETCH_GROUP_FAILURE:
    case DELETE_GROUP_REQUEST:
    case DELETE_GROUP_FAILURE:
    case ADD_COMPONENT_REQUEST:
    case ADD_COMPONENT_FAILURE:
    case NEW_COMPONENT_REQUEST:
    case NEW_COMPONENT_FAILURE:
    case DELETE_COMPONENT_FAILURE:
    case DELETE_COMPONENT_SUCCESS:
    default:
      return state;
  }
}

export default componentsPageReducer;
