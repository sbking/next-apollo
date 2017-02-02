import createClient from './createClient';
import memoize from 'lodash/memoize';

const cachedCreateClient = memoize(createClient);

export default (uri) => process.browser ? cachedCreateClient(uri) : createClient(uri);
