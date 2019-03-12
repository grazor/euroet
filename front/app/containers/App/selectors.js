/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectAuth = state => state.get('auth');

const selectRouter = state => state.get('router');

const makeSelectUser = () =>
  createSelector(selectAuth, authState => authState.get('user'));

const makeSelectIsAuthenticated = () =>
  createSelector(selectAuth, authState => authState.get('isAuthenticated'));

const makeSelectLocation = () =>
  createSelector(selectRouter, routerState =>
    routerState.get('location').toJS(),
  );

export { makeSelectUser, makeSelectIsAuthenticated, makeSelectLocation };
