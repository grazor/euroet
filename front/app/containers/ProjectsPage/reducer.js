/*
 *
 * ProjectsPage reducer
 *
 */

import { fromJS } from 'immutable';

import {
  PROJECTS_FAILURE,
  PROJECTS_REQUEST,
  PROJECTS_SUCCESS,
  PROJECT_CREATE_FAILURE,
  PROJECT_CREATE_REQUEST,
  PROJECT_CREATE_SUCCESS,
} from './constants';

export const initialState = fromJS({
  projects: [],
  isLoading: false,
  isUpdating: false,
});

function projectsPageReducer(state = initialState, action) {
  switch (action.type) {
    // Fetching projects
    case PROJECTS_REQUEST:
      return state.set('isLoading', true);
    case PROJECTS_SUCCESS:
      return state
        .set('projects', fromJS(action.projects))
        .set('isLoading', false);
    case PROJECTS_FAILURE:
      return state.set('isLoading', false);

    case PROJECT_CREATE_REQUEST:
      return state.set('isUpdating', true);
    case PROJECT_CREATE_FAILURE:
      return state.set('isUpdating', false);
    case PROJECT_CREATE_SUCCESS:
      return state
        .set('isUpdating', false)
        .update('projects', projects =>
          projects.insert(0, fromJS(action.project)),
        );

    default:
      return state;
  }
}

export default projectsPageReducer;
