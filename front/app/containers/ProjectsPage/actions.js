/*
 *
 * ProjectsPage actions
 *
 */

import { PROJECTS_REQUEST } from './constants';

export function fetchProjects() {
  return {
    type: PROJECTS_REQUEST,
  };
}
