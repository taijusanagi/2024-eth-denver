import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const uri = "https://api.studio.thegraph.com/query/66919/storyteller/v0.0.1";
const httpLink = new HttpLink({
  uri,
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
