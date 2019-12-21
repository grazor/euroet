/*
 *
 * ComponentsCatalog actions
 *
 */

import { LOAD_COMPONENTS_REQUEST } from './constants';

export function loadComponents(page, filter) {
  return {
    type: LOAD_COMPONENTS_REQUEST,
    page: page === undefined ? 1 : page + 1,
    filter: filter || '',
  };
}
