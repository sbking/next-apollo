import { ApolloProvider, getDataFromTree } from 'react-apollo';
import React from 'react';
import 'isomorphic-fetch';

const getApolloState = (client) => ({
  [client.reduxRootKey]: client.getInitialState(),
});

export const withData = (Component) => {
  let { getInitialProps, getApolloClient, getReduxStore } = Component;
  getInitialProps = getInitialProps ? getInitialProps.bind(Component) : () => ({});
  getReduxStore = getReduxStore ? getReduxStore.bind(Component) : () => undefined;
  getApolloClient = getApolloClient.bind(Component);
  
  return class extends React.Component {
    static async getInitialProps (context) {
      const props = await getInitialProps(context);
      const client = getApolloClient(props);
      props.initialState = getApolloState(client);
      const store = getReduxStore(client, props);

      if (!process.browser) {
        await getDataFromTree(this.prototype.render.call({ client, store, props }));
      }

      props.initialState = { ...store.getState(), ...getApolloState(client) };
      return props;
    }

    constructor (props) {
      super(props);
      this.client = getApolloClient(props);
      this.store = getReduxStore(this.client, props);
    }

    render () {
      return (
        <ApolloProvider client={this.client} store={this.store}>
          <Component {...this.props} />
        </ApolloProvider>
      );
    }
  }
};
