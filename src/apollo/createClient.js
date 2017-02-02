import ApolloClient, { createNetworkInterface } from 'apollo-client';

export default (uri) => (
  new ApolloClient({
    ssrMode: !process.browser,
    dataIdFromObject: result => result.id || null,
    networkInterface: createNetworkInterface({
      uri,
      opts: {
        credentials: 'same-origin'
      }
    })
  })
);
