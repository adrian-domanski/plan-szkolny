const graphql = require("graphql");

const { GraphQLSchema } = graphql;

// Queries
const RootQuery = require("./RootQuery");
// Mutations
const RootMutation = require("./RootMutations");

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
});
