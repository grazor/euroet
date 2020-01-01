/*
 *
 * ComponentImportPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  IMPORTS_REQUEST,
  IMPORTS_SUCCESS,
  IMPORTS_FAILURE,
  IMPORT_FILE_REQUEST,
  IMPORT_FILE_SUCCESS,
  IMPORT_FILE_FAILURE,
} from './constants';

export const initialState = fromJS({ imports: [], isLoading: false });

function componentImportPageReducer(state = initialState, action) {
  switch (action.type) {
    case IMPORTS_REQUEST:
    case IMPORT_FILE_REQUEST:
      return state.set('isLoading', true);
    case IMPORTS_SUCCESS:
      return state
        .set('imports', fromJS(action.imports))
        .set('isLoading', false);
    case IMPORT_FILE_SUCCESS:
      return state
        .set('isLoading', false)
        .update('imports', imports => imports.insert(0, fromJS(action.data)));
    case IMPORTS_FAILURE:
    case IMPORT_FILE_FAILURE:
      return state.set('isLoading', false);
    default:
      return state;
  }
}

export default componentImportPageReducer;
