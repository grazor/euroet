/*
 *
 * ComponentImportPage actions
 *
 */

import { IMPORTS_REQUEST, IMPORT_FILE_REQUEST } from './constants';

export function loadImportsHistory(silent = false) {
  return {
    type: IMPORTS_REQUEST,
    silent,
  };
}

export function importFile(file) {
  return {
    type: IMPORT_FILE_REQUEST,
    file,
  };
}
