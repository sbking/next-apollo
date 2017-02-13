import { ApolloProvider, getDataFromTree } from 'react-apollo';
import React from 'react';
import 'isomorphic-fetch';
import 'babel-polyfill';

export const withData = (factory, Component) => (
  class extends React.Component {
    static async getInitialProps (ctx) {
      const { client, store, props: customProps } = factory(ctx);

      const initialProps = {
        ...await (Component.getInitialProps ? Component.getInitialProps(ctx) : {}),
        ...customProps,
      };

      if (!process.browser) {
        const app = (
          <ApolloProvider client={client} store={store}>
            <Component {...initialProps} />
          </ApolloProvider>
        );
        await getDataFromTree(app);
      }

      const state = store.getState();
      return {
        initialState: {
          ...state,
          [client.reduxRootKey]: client.getInitialState(),
        },
        ...initialProps,
        ...customProps,
      };
    }

    constructor (props) {
      super(props);
      const { client, store } = factory(null, props);
      this.client = client;
      this.store = store;
    }

    render () {
      return (
        <ApolloProvider client={this.client} store={this.store}>
          <Component {...this.props} />
        </ApolloProvider>
      );
    }
  }
);
