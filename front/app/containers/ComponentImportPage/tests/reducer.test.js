import { fromJS } from 'immutable';
import componentImportPageReducer from '../reducer';

describe('componentImportPageReducer', () => {
  it('returns the initial state', () => {
    expect(componentImportPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
