const graphql = require("graphql");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLBoolean
} = graphql;

// User type
const UserType = new GraphQLObjectType({
  name: "UserType",
  fields: () => ({
    name: { type: GraphQLString },
    surname: { type: GraphQLString },
    tasks: { type: GraphQLList(TaskType) },
    confirmed: { type: GraphQLBoolean },
    class: {
      type: ClassType,
      resolve: async (parent, _, ctx) => {
        const myClass = await ctx.loaders.classByCodes.load(parent.class.code);

        return myClass;
      }
    },
    rank: {
      type: GraphQLString,
      resolve: parent => parent.class.rank
    },
    avatar: {
      type: ImageType
    },
    id: { type: GraphQLID },
    email: { type: GraphQLString }
  })
});

// Image type
const ImageType = new GraphQLObjectType({
  name: "ImageType",
  fields: () => ({
    id: { type: GraphQLID },
    filename: { type: GraphQLString },
    url: { type: GraphQLString }
  })
});

// Login type
const LoginType = new GraphQLObjectType({
  name: "LoginType",
  fields: () => ({
    user: {
      type: UserType,
      resolve: async (parent, _, ctx) => {
        try {
          const myUser = await ctx.loaders.userByIds.load(parent.userId);

          // Check if has outdated tasks
          let outdated = [];
          myUser.tasks.forEach(task => {
            const taskDate = new Date(task.date).setHours(0, 0, 0, 0);
            const now = new Date().setHours(0, 0, 0, 0);
            if (taskDate < now) {
              outdated.push(task.id);
            }
          });

          // If has outdated - remove
          if (outdated.length) {
            await myUser.updateOne({
              $pull: { tasks: { _id: { $in: outdated } } }
            });
          }

          return myUser;
        } catch (err) {
          throw err;
        }
      }
    },
    token: { type: GraphQLString }
  })
});

// Task type
const TaskType = new GraphQLObjectType({
  name: "TaskType",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    date: { type: GraphQLString },
    color: { type: GraphQLString }
  })
});

// Notification type
const NotificationType = new GraphQLObjectType({
  name: "NotificationType",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    date: { type: GraphQLString },
    importance: { type: GraphQLString }
  })
});

// Class member type

const ClassMemberType = new GraphQLObjectType({
  name: "ClassMemberType",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    surname: { type: GraphQLString },
    rank: { type: GraphQLString }
  })
});

// Class type
const ClassType = new GraphQLObjectType({
  name: "ClassType",
  fields: () => ({
    id: { type: GraphQLID },
    code: { type: GraphQLID },
    name: { type: GraphQLString },
    tasks: { type: GraphQLList(TaskType) },
    notifications: { type: GraphQLList(NotificationType) },
    plan: { type: ImageType },
    messages: { type: GraphQLList(ChatboxMessageType) },
    replacements: {
      type: ReplacementsType,
      resolve: parent => parent.replacements
    },
    owner: {
      type: UserType,
      resolve: async (parent, _, ctx) => {
        return ctx.loaders.userByIds.load(parent.owner);
      }
    },
    users: {
      type: GraphQLList(ClassMemberType),
      resolve: async (parent, _, ctx) => {
        return ctx.loaders.userByIds.loadMany(parent.users);
      }
    }
  })
});

const ReplacementsType = new GraphQLObjectType({
  name: "ReplacementsType",
  fields: () => ({
    today: { type: GraphQLString },
    tomorrow: { type: GraphQLString },
    dayAfter: { type: GraphQLString },
    page: { type: GraphQLString }
  })
});

// Message type
const MessageType = new GraphQLObjectType({
  name: "MessageType",
  fields: () => ({
    msg: { type: GraphQLString }
  })
});

const ChatboxMessageType = new GraphQLObjectType({
  name: "ChatboxMessageType",
  fields: () => ({
    id: { type: GraphQLID },
    msg: { type: GraphQLString },
    author: {
      type: UserType,
      resolve: async (parent, _, ctx) => {
        const fetchedUser = await ctx.loaders.userByIds.load(parent.author);
        return fetchedUser;
      }
    },
    date: { type: GraphQLString }
  })
});

module.exports = {
  UserType,
  LoginType,
  TaskType,
  NotificationType,
  ClassType,
  ImageType,
  MessageType,
  ChatboxMessageType
};
