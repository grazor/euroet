/*
 *
 * ComponentsPage actions
 *
 */

import { PRODUCT_INFO_REQUEST } from './constants';

export function fetchProduct(projectSlug, productSlug) {
  return {
    type: PRODUCT_INFO_REQUEST,
    projectSlug,
    productSlug,
  };
}
