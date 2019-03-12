import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectAuth = state => state.get('auth', initialState);

const makeSelectUser = () =>
  createSelector(selectAuth, authState => authState.get('user'));

export { makeSelectUser };