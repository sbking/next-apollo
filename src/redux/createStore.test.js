jest.mock('redux');

import { createStore as createReduxStore } from 'redux';

import createStore from './createStore';

describe('createStore', () => {
  const CLIENT = {};
  const STATE = {};
  const OBJECT = {};
  
  beforeEach(() => {
    createReduxStore.mockReset();
  });

  it('returns a redux Store instance', () => {
    createReduxStore.mockReturnValueOnce(OBJECT);
    const store = createStore(CLIENT, STATE);
    expect(createReduxStore).toHaveBeenCalledTimes(1);
    expect(store).toBe(OBJECT);
  });
});
