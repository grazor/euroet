import { createSelector } from 'reselect';

import { initialState } from './reducer';

const selectProjectsPageDomain = state => state.get('projects', initialState);

const makeSelectProjects = () =>
  createSelector(selectProjectsPageDomain, projectsState =>
    projectsState.get('projects').toJS(),
  );

const makeSelectIsLoading = () =>
  createSelector(selectProjectsPageDomain, projectsState =>
    projectsState.get('isLoading'),
  );

const makeSelectIsUpdating = () =>
  createSelector(selectProjectsPageDomain, projectsState =>
    projectsState.get('isUpdating'),
  );

export {
  selectProjectsPageDomain,
  makeSelectProjects,
  makeSelectIsLoading,
  makeSelectIsUpdating,
};
