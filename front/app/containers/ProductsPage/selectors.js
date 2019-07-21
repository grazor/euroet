import { createSelector } from 'reselect';

import { initialState } from './reducer';

const selectProductsPageDomain = state => state.get('products', initialState);

const makeSelectProject = () =>
  createSelector(
    selectProductsPageDomain,
    productsState => productsState.get('project').toJS(),
  );

const makeSelectProducts = () =>
  createSelector(
    selectProductsPageDomain,
    productsState => productsState.get('products').toJS(),
  );

const makeSelectIsLoading = () =>
  createSelector(
    selectProductsPageDomain,
    productsState => productsState.get('isLoading'),
  );

const makeSelectIsUpdating = () =>
  createSelector(
    selectProductsPageDomain,
    productsState => productsState.get('isUpdating'),
  );
export const makeSelectReports = () =>
  createSelector(
    selectProductsPageDomain,
    productsState => productsState.get('reports').toJS(),
  );

export const makeSelectReportStatus = () =>
  createSelector(
    selectProductsPageDomain,
    productsState => productsState.get('reportStatus'),
  );

export {
  selectProductsPageDomain,
  makeSelectProject,
  makeSelectProducts,
  makeSelectIsLoading,
  makeSelectIsUpdating,
};
