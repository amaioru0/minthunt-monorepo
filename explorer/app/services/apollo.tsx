import React from 'react';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getAccessToken } from 'react-native-axios-jwt'
import { signApi} from '../utils/signLocation';

const httpLink = createHttpLink({
    uri: 'https://minthunt.io:1338/graphql',
  });
  
  const authLink = setContext(async (_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = await getAccessToken();
    // return the headers to the context so httpLink can read them
    const randomNumber= Math.floor(Math.random() * 90000) + 10000;
    const signature = await signApi(randomNumber)
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
        signature: signature,
        random: randomNumber
      }
    }
  });
  
  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  });

  // const client = new ApolloClient({
  //   uri: 'https://cm.homebox.ie:1338/graphql',
  //   cache: new InMemoryCache()
  // });

  export default client;