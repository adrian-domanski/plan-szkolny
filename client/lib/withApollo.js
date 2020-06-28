import withApollo from "next-with-apollo";
import ApolloClient from "apollo-client";
import { ApolloProvider } from "react-apollo";
import { createUploadLink } from "apollo-upload-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import cookie from "next-cookies";

const isServer = () => typeof window === "undefined";

export default withApollo(
  ({ initialState, ctx }) => {
    const dev = process.env.NODE_ENV !== "production";
    return new ApolloClient({
      cache: new InMemoryCache().restore(initialState || {}),
      link: createUploadLink({
        credentials: "include",
        uri: dev
          ? "http://localhost:5000/graphql"
          : "https://api.plan-szkolny.pl/graphql",
        headers: isServer() && {
          token: cookie(ctx).token,
        },
      }),
    });
  },
  {
    render: ({ Page, props }) => {
      return (
        <ApolloProvider client={props.apollo}>
          <Page {...props} />
        </ApolloProvider>
      );
    },
  }
);
