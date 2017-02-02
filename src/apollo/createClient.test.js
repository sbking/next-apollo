jest.mock('apollo-client');

import ApolloClient, { createNetworkInterface } from 'apollo-client';

import createClient from './createClient';

describe('createClient', () => {
  const URI = 'https://test.com/';
  const URI_A = 'https://test.com/a';
  const URI_B = 'https://test.com/b';
  const OBJECT = {};

  beforeEach(() => {
    ApolloClient.mockReset();
    createNetworkInterface.mockReset();
  });
  
  afterEach(() => {
    delete process.browser;
  })

  it('returns an ApolloClient instance', () => {
    let client = createClient(URI);
    expect(ApolloClient).toHaveBeenCalledTimes(1);
    expect(client).toBe(ApolloClient.mock.instances[0]);
  });

  it('creates and uses a new NetworkInterface instance', () => {
    createNetworkInterface.mockReturnValueOnce(OBJECT)
    createClient(URI);
    expect(createNetworkInterface).toHaveBeenCalledTimes(1);
    expect(ApolloClient).toHaveBeenCalledWith(expect.objectContaining({ networkInterface: OBJECT }));
  })

  it('uses the given GraphQL endpoint URI', () => {
    createClient(URI_A);
    createClient(URI_B);
    expect(createNetworkInterface).toHaveBeenCalledTimes(2);
    expect(createNetworkInterface).toHaveBeenCalledWith(expect.objectContaining({ uri: URI_A }));
    expect(createNetworkInterface).toHaveBeenLastCalledWith(expect.objectContaining({ uri: URI_B }));
  });

  it('only sends cookies to endpoints on the same origin', () => {
    createClient(URI);
    expect(createNetworkInterface).toHaveBeenCalledWith(expect.objectContaining({
      opts: expect.objectContaining({ credentials: 'same-origin' })
    }));
  });

  it('enables SSR on the server', () => {
    createClient(URI);
    expect(ApolloClient).toHaveBeenCalledWith(expect.objectContaining({ ssrMode: true }));
  });

  it('disables SSR on the browser', () => {
    process.browser = true;
    createClient(URI);
    expect(ApolloClient).toHaveBeenCalledWith(expect.objectContaining({ ssrMode: false }));
  });

  it('uses the `id` property or null for object ID generation', () => {
    createClient(URI);
    let { dataIdFromObject } = ApolloClient.mock.calls[0][0];
    expect(dataIdFromObject).toBeInstanceOf(Function);
    expect(dataIdFromObject({ id: 100, name: 'foo' })).toBe(100);
    expect(dataIdFromObject({ id: 'bar', name: 'bar' })).toBe('bar');
    expect(dataIdFromObject({ name: 'baz' })).toBe(null);
  });
});
