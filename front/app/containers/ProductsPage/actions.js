/*
 *
 * ProjectsPage actions
 *
 */

import {
  PRODUCT_CREATE_REQUEST,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_UPDATE_REQUEST,
  PROJECT_INFO_REQUEST,
} from './constants';

export function fetchProject(slug) {
  return {
    type: PROJECT_INFO_REQUEST,
    slug,
  };
}

export function addProduct({ projectSlug, name, slug, description }) {
  return {
    type: PRODUCT_CREATE_REQUEST,
    projectSlug,
    name,
    slug,
    description,
  };
}

export function updateProduct({
  projectSlug,
  originalSlug,
  name,
  slug,
  description,
}) {
  return {
    type: PRODUCT_UPDATE_REQUEST,
    projectSlug,
    originalSlug,
    name,
    slug,
    description,
  };
}

export function deleteProduct(projectSlug, slug) {
  return {
    type: PRODUCT_DELETE_REQUEST,
    projectSlug,
    slug,
  };
}
