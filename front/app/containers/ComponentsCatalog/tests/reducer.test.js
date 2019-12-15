import { fromJS } from 'immutable';
import componentsCatalogReducer from '../reducer';

describe('componentsCatalogReducer', () => {
  it('returns the initial state', () => {
    expect(componentsCatalogReducer(undefined, {})).toEqual(fromJS({}));
  });
});
