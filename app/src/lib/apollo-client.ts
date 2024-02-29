import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const uri = "https://api.studio.thegraph.com/query/66919/content-nft-2/v0.0.2";
console.log(uri);

const httpLink = new HttpLink({
  uri,
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
