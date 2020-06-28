const graphql = require("graphql");

// Mutations
const userMutations = require("./mutations/userMutations");
const taskMutations = require("./mutations/taskMutations");
const notificationMutations = require("./mutations/notificationMutations");
const classMutations = require("./mutations/classMutations");

const { GraphQLObjectType } = graphql;

const RootMutation = new GraphQLObjectType({
  name: "RootMutationType",
  fields: {
    ...userMutations,
    ...taskMutations,
    ...notificationMutations,
    ...classMutations
  }
});

module.exports = RootMutation;
