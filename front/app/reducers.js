/**
 * Combine all reducers in this file and export the combined reducers.
 */

import globalReducer from 'containers/App/reducer';
import history from 'utils/history';
import languageProviderReducer from 'containers/LanguageProvider/reducer';
import { combineReducers } from 'redux-immutable';
import { connectRouter } from 'connected-react-router/immutable';

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export default function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    global: globalReducer,
    router: connectRouter(history),
    language: languageProviderReducer,
    ...injectedReducers,
  });

  // Wrap the root reducer and return a new root reducer with router state
  return rootReducer;
}
