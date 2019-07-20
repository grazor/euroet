import { createSelector } from 'reselect';

import { initialState } from './reducer';

const selectComponentsPageDomain = state =>
  state.get('components', initialState);

export const makeSelectProduct = () =>
  createSelector(
    selectComponentsPageDomain,
    components => components.get('product').toJS(),
  );

export const makeSelectComponents = () =>
  createSelector(
    selectComponentsPageDomain,
    components => components.get('components').toJS(),
  );

export const makeSelectReports = () =>
  createSelector(
    selectComponentsPageDomain,
    components => components.get('reports').toJS(),
  );

export const makeSelectReportStatus = () =>
  createSelector(
    selectComponentsPageDomain,
    components => components.get('reportStatus'),
  );

export const makeSelectIsLoading = () =>
  createSelector(
    selectComponentsPageDomain,
    components => components.get('isUpdating'),
  );

export const makeSelectIsUpdating = () =>
  createSelector(
    selectComponentsPageDomain,
    components => components.get('isLoading'),
  );

export const makeSelectSuggestions = () =>
  createSelector(
    selectComponentsPageDomain,
    components => components.get('suggestions').toJS(),
  );

export const makeSelectTotalPrice = () =>
  createSelector(
    selectComponentsPageDomain,
    components =>
      components
        .get('components')
        .map(group => parseFloat(group.get('total_price')) || 0)
        .reduce((a, b) => a + b, 0),
  );
