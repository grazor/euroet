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
  PROJECT_DELETE_FAILURE,
  PROJECT_DELETE_REQUEST,
  PROJECT_DELETE_SUCCESS,
  PROJECT_UPDATE_FAILURE,
  PROJECT_UPDATE_REQUEST,
  PROJECT_UPDATE_SUCCESS,
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
    case PROJECT_UPDATE_REQUEST:
    case PROJECT_DELETE_REQUEST:
      return state.set('isUpdating', true);
    case PROJECT_CREATE_FAILURE:
    case PROJECT_UPDATE_FAILURE:
    case PROJECT_DELETE_FAILURE:
      return state.set('isUpdating', false);
    case PROJECT_CREATE_SUCCESS:
      return state
        .set('isUpdating', false)
        .update('projects', projects =>
          projects.insert(0, fromJS(action.project)),
        );

    case PROJECT_UPDATE_SUCCESS:
      return state
        .set('isUpdating', false)
        .update('projects', projects =>
          projects.map(
            project =>
              project.get('slug') === action.originalSlug
                ? fromJS(action.project)
                : project,
          ),
        );

    case PROJECT_DELETE_SUCCESS:
      return state
        .set('isUpdating', false)
        .update('projects', projects =>
          projects.filter(project => project.get('slug') !== action.slug),
        );

    default:
      return state;
  }
}

export default projectsPageReducer;
