/*
 *
 * ProjectsPage actions
 *
 */

import {
  PROJECTS_REQUEST,
  PROJECT_CREATE_REQUEST,
  PROJECT_DELETE_REQUEST,
  PROJECT_TOGGLE_STAR_REQUEST,
  PROJECT_UPDATE_REQUEST,
} from './constants';

export function fetchProjects() {
  return {
    type: PROJECTS_REQUEST,
  };
}

export function addProject({ name, slug, description }) {
  return {
    type: PROJECT_CREATE_REQUEST,
    name,
    slug,
    description,
  };
}

export function updateProject({ originalSlug, name, slug, description }) {
  return {
    type: PROJECT_UPDATE_REQUEST,
    originalSlug,
    name,
    slug,
    description,
  };
}

export function deleteProject(slug) {
  return {
    type: PROJECT_DELETE_REQUEST,
    slug,
  };
}

export function setProjectStar(slug, isSet) {
  return {
    type: PROJECT_TOGGLE_STAR_REQUEST,
    slug,
    isSet,
  };
}
