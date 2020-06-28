const Class = require("../../models/Class");
const graphql = require("graphql");
const { isClassMember } = require("../../helpers/authHelpers");

const { ChatboxMessageType } = require("../objectTypes");

const { GraphQLList } = graphql;

const getLastMessages = {
  type: GraphQLList(ChatboxMessageType),
  resolve: async (_, __, ctx) => {
    const fetchedUser = await isClassMember(ctx);

    const myClass = await Class.findOne({ code: fetchedUser.class.code });
    if (!myClass) {
      throw new Error("Nie odnaleziono klasy o takim kodzie");
    }

    const filteredMessages = myClass.messages
      .sort((a, b) => new Date(a.date) > new Date(b.date))
      .slice(0, 20);

    return filteredMessages;
  },
};

module.exports = {
  getLastMessages,
};
