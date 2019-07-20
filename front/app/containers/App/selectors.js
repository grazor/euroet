/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectGlobal = state => state.get('global');

const selectRouter = state => state.get('router');

const makeSelectUser = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.get('user'),
  );

const makeSelectIsAuthenticated = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.get('isAuthenticated'),
  );

const makeSelectNotifications = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.get('notifications').toJS(),
  );

const makeSelectLocation = () =>
  createSelector(
    selectRouter,
    routerState => routerState.get('location').toJS(),
  );

export {
  makeSelectUser,
  makeSelectIsAuthenticated,
  makeSelectLocation,
  makeSelectNotifications,
};
