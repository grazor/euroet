import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the componentImportPage state domain
 */

const selectComponentImportPageDomain = state =>
  state.get('componentImportPage', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by ComponentImportPage
 */

const makeSelectComponentImportPage = () =>
  createSelector(
    selectComponentImportPageDomain,
    substate => substate.toJS(),
  );

export default makeSelectComponentImportPage;
export { selectComponentImportPageDomain };
