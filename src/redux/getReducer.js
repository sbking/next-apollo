import { combineReducers } from 'redux';

export default (apolloClient) => {
  const apollo = apolloClient.reducer();
  
  return combineReducers({ apollo });
}
