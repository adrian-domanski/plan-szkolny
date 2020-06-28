const graphql = require("graphql");
const Notification = require("../../models/Notification");
const Class = require("../../models/Class");
const { isClassAdmin } = require("../../helpers/authHelpers");

// Object Types
const { NotificationType } = require("../objectTypes");

const { GraphQLString, GraphQLID, GraphQLNonNull } = graphql;

// Create new notification
const createNotification = {
  type: NotificationType,
  args: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    date: { type: new GraphQLNonNull(GraphQLString) },
    importance: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async (_, args, ctx) => {
    const fetchedUser = await isClassAdmin(ctx);

    const { title, description, date, importance } = args;
    if (!title || !date || !importance) {
      throw new Error(
        "Błąd podczas tworzenia powiadomienia: Podaj wszystkie dane"
      );
    }
    const myClass = await Class.findOne({ code: fetchedUser.class.code });
    if (!myClass) {
      throw new Error("Nie odnaleziono klasy o takim kodzie");
    }
    const newNotification = new Notification({
      title,
      description,
      date,
      importance
    });
    await myClass.updateOne({ $push: { notifications: newNotification } });
    return newNotification;
  }
};

// Delete notification
const deleteNotification = {
  type: NotificationType,
  args: {
    notificationId: { type: GraphQLID }
  },
  resolve: async (_, args, ctx) => {
    const fetchedUser = await isClassAdmin(ctx);

    const { notificationId } = args;

    if (!notificationId) {
      throw new Error("Błąd podczas usuwania zadania: podaj id zadania");
    }

    const myClass = await Class.findOneAndUpdate(
      { code: fetchedUser.class.code },
      {
        $pull: { notifications: { _id: notificationId } }
      },
      { useFindAndModify: false }
    );

    if (!myClass) {
      throw new Error(
        "Delete Task Error: Invalid class code - class doesn't exist"
      );
    }

    const deletedNotification = myClass.notifications.find(
      notif => notif._id.toString() === notificationId
    );

    return deletedNotification;
  }
};

// Edit notification
const editNotification = {
  type: NotificationType,
  args: {
    notificationId: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    date: { type: GraphQLString },
    importance: { type: GraphQLString }
  },
  resolve: async (_, args, ctx) => {
    const fetchedUser = await isClassAdmin(ctx);

    const { title, description, date, notificationId, importance } = args;

    const myClass = await Class.findOneAndUpdate(
      { "notifications._id": notificationId, code: fetchedUser.class.code },
      {
        $set: {
          "notifications.$.title": title,
          "notifications.$.description": description,
          "notifications.$.date": date,
          "notifications.$.importance": importance
        }
      },
      { useFindAndModify: false, new: true }
    );

    if (!myClass) {
      throw new Error(
        "Błąd podczas edycji powiadomienia: taka klasa nie istnieje"
      );
    }

    const editedNotification = myClass.notifications.find(
      notification => notification._id.toString() === notificationId
    );

    return editedNotification;
  }
};

module.exports = {
  deleteNotification,
  createNotification,
  editNotification
};
