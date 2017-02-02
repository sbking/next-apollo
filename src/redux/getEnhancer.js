import { applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

export default (apolloClient) => {
  const apollo = apolloClient.middleware();
  return composeWithDevTools(applyMiddleware(apollo));
};
