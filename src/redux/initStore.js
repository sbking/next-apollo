import createStore from './createStore';
import memoize from 'lodash/memoize';

const cachedCreateStore = memoize(createStore);

export default (...args) => (
  process.browser ? cachedCreateStore(...args) : createStore(...args)
);
