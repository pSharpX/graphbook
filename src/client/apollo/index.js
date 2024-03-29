import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { onError } from "apollo-link-error";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

import gql from "graphql-tag";

const port = location.port ? ':'+location.port: '';

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
        if (networkError) console.log(`[Network error]: ${networkError}`);
      }
    }),
    new HttpLink({
      uri: location.protocol + '//' + location.hostname + port + '/graphql'
    })
  ]),
  cache: new InMemoryCache()
});

export default client;
