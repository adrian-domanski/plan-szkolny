const graphql = require("graphql");

const { GraphQLObjectType } = graphql;
const userQueries = require("./queries/userQueries");
const classQueries = require("./queries/classQueries");
const messageQueries = require("./queries/messageQueries");

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    ...userQueries,
    ...classQueries,
    ...messageQueries
  }
});

module.exports = RootQuery;
