import { createSelector } from 'reselect';

import { initialState } from './reducer';

const selectComponentsPageDomain = state =>
  state.get('components', initialState);

export const makeSelectProduct = () =>
  createSelector(selectComponentsPageDomain, components =>
    components.get('product').toJS(),
  );

export const makeSelectComponents = () =>
  createSelector(selectComponentsPageDomain, components =>
    components.get('components').toJS(),
  );

export const makeSelectIsLoading = () =>
  createSelector(selectComponentsPageDomain, components =>
    components.get('isUpdating'),
  );

export const makeSelectIsUpdating = () =>
  createSelector(selectComponentsPageDomain, components =>
    components.get('isLoading'),
  );
