/*
 *
 * ComponentsCatalog actions
 *
 */

import { LOAD_COMPONENTS_REQUEST } from './constants';

export function loadComponents(page, filter) {
  return {
    type: LOAD_COMPONENTS_REQUEST,
    page: page || 1,
    filter: filter || '',
  };
}
