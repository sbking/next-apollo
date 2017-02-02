import { ApolloProvider, getDataFromTree } from 'react-apollo';
import React from 'react';
import 'isomorphic-fetch';
import { initClient } from '../apollo/initClient';
import initStore from './initStore';

const uri = 'https://api.graph.cool/simple/v1/cixmkt2ul01q00122mksg82pn';

export default (Component) => (
  class extends React.Component {
    static async getInitialProps (context) {
      const { query, pathname } = context;
      const apolloClient = initClient(uri);
      const reduxStore = initStore(apolloClient, apolloClient.initialState);
      const props = {
        url: { query, pathname },
        ...await (Component.getInitialProps ? Component.getInitialProps(context) : {})
      };

      if (!process.browser) {
        const app = (
          <ApolloProvider client={apolloClient} store={reduxStore}>
            <Component {...props} />
          </ApolloProvider>
        );
        await getDataFromTree(app);
      }

      const state = reduxStore.getState();
      return {
        initialState: {
          ...state,
          apollo: {
            data: state.apollo.data
          }
        },
        ...props
      };
    }

    constructor(props) {
      super(props);
      this.apolloClient = initClient(uri);
      this.reduxStore = initStore(this.apolloClient, this.props.initialState);
    }

    render () {
      return (
        <ApolloProvider client={this.apolloClient} store={this.reduxStore}>
          <Component {...this.props} />
        </ApolloProvider>
      )
    }
  }
);
