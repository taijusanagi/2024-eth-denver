import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { graphQLUri } from "./contracts";

const httpLink = new HttpLink({
  uri: graphQLUri,
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
