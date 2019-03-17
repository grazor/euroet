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

export { selectProjectsPageDomain, makeSelectProjects, makeSelectIsLoading };
