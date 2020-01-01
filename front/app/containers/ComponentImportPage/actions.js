/*
 *
 * ComponentImportPage actions
 *
 */

import { IMPORTS_REQUEST, IMPORT_FILE_REQUEST } from './constants';

export function loadImportsHistory() {
  return {
    type: IMPORTS_REQUEST,
  };
}

export function importFile(file) {
  return {
    type: IMPORT_FILE_REQUEST,
    file,
  };
}
