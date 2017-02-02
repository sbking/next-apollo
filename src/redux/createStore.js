import { createStore as createReduxStore } from 'redux';
import getReducer from './getReducer';
import getEnhancer from './getEnhancer';

export default (apolloClient, initialState) => (
  createReduxStore(getReducer(apolloClient), initialState, getEnhancer(apolloClient))
);
