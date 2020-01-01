import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectComponentImportPageDomain = state =>
  state.get('componentImportPage', initialState);

const makeSelectImports = () =>
  createSelector(
    selectComponentImportPageDomain,
    substate => substate.get('imports').toJS(),
  );

const makeSelectIsLoading = () =>
  createSelector(
    selectComponentImportPageDomain,
    substate => substate.get('isLoading'),
  );

export {
  selectComponentImportPageDomain,
  makeSelectIsLoading,
  makeSelectImports,
};
