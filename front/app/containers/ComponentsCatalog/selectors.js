import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the componentsCatalog state domain
 */

const selectComponentsCatalogDomain = state =>
  state.get('componentsCatalog', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by ComponentsCatalog
 */

const makeSelectIsLoading = () =>
  createSelector(
    selectComponentsCatalogDomain,
    componentsState => componentsState.get('isLoading'),
  );

const makeSelectCatalog = () =>
  createSelector(
    selectComponentsCatalogDomain,
    componentsState => componentsState.get('components').toJS(),
  );

const makeSelectCount = () =>
  createSelector(
    selectComponentsCatalogDomain,
    componentsState => componentsState.get('count'),
  );

const makeSelectPage = () =>
  createSelector(
    selectComponentsCatalogDomain,
    componentsState => componentsState.get('page'),
  );

export {
  makeSelectIsLoading,
  makeSelectCatalog,
  makeSelectCount,
  makeSelectPage,
};
