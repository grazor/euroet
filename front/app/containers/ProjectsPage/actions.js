/*
 *
 * ProjectsPage actions
 *
 */

import {
  PROJECTS_REQUEST,
  PROJECT_CREATE_REQUEST,
  PROJECT_DELETE_REQUEST,
} from './constants';

export function fetchProjects() {
  return {
    type: PROJECTS_REQUEST,
  };
}
