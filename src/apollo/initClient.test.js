jest.mock('./createClient');

import createClient from './createClient';
import initClient from './initClient';

describe('initClient', () => {
  const URI = 'https://test.com/';
  const URI_A = 'https://test.com/a';
  const URI_B = 'https://test.com/b';
  const OBJECT = {};

  beforeEach(() => {
    createClient.mockReset();
  });
  
  afterEach(() => {
    delete process.browser;
  });
  
  describe('returns an ApolloClient instance with the given GraphQL endpoint URI', () => {
    test('on the server', () => {
      createClient.mockReturnValueOnce(OBJECT);
      const client = initClient(URI);
      expect(createClient).toHaveBeenCalledWith(URI);
      expect(client).toBe(OBJECT);
    });
    
    test('on the browser', () => {
      process.browser = true;
      createClient.mockReturnValueOnce(OBJECT);
      const client = initClient(URI);
      expect(createClient).toHaveBeenCalledWith(URI);
      expect(client).toBe(OBJECT);
    });
  });

  it('creates a new client instance for each call on the server', () => {
    createClient.mockImplementation(() => ({}));
    const [ A1, A2, B1, B2 ] = [URI_A, URI_A, URI_B, URI_B].map(initClient);
    expect(createClient).toHaveBeenCalledTimes(4);
    expect(A1).not.toBe(A2);
    expect(B1).not.toBe(B2);
    expect(A1).not.toBe(B1);
  });

  it('memoizes returned client instances in the browser', () => {
    process.browser = true;
    createClient.mockImplementation(() => ({}));
    const [ A1, A2, B1, B2 ] = [URI_A, URI_A, URI_B, URI_B].map(initClient);
    expect(createClient).toHaveBeenCalledTimes(2);
    expect(A1).toBe(A2);
    expect(B1).toBe(B2);
    expect(A1).not.toBe(B1);
  });
});
