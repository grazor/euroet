import { createSelector } from 'reselect';
import { initialState } from 'containers/App/reducer';

const selectAuth = state => state.get('global', initialState);

const makeSelectUser = () =>
  createSelector(
    selectAuth,
    authState => authState.get('user'),
  );

export { makeSelectUser };
