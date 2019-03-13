/*
 *
 * ProjectsPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  PROJECTS_REQUEST,
  PROJECTS_SUCCESS,
  PROJECTS_FAILURE,
} from './constants';

export const initialState = fromJS({
  projects: [],
  isLoading: false,
  error: null,
});

function projectsPageReducer(state = initialState, action) {
  switch (action.type) {
    // Fetching projects
    case PROJECTS_REQUEST:
      return state.set('isLoading', true);
    case PROJECTS_SUCCESS:
      return state.set('projects', action.projects).set('isLoading', false);
    case PROJECTS_FAILURE:
      return state.set('error', action.message).set('isLoading', false);

    default:
      return state;
  }
}

export default projectsPageReducer;
