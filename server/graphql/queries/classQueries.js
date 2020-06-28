const Class = require("../../models/Class");
const graphql = require("graphql");
const { isClassMember } = require("../../helpers/authHelpers");
const User = require("../../models/User");

const {
  ClassType,
  TaskType,
  NotificationType,
  UserType,
} = require("../objectTypes");

const { GraphQLNonNull, GraphQLID, GraphQLList } = graphql;

// Get class by code
const getClassByCode = {
  type: ClassType,
  resolve: async (_, __, ctx) => {
    const fetchedUser = await isClassMember(ctx);
    const myClass = await Class.findOne({ code: fetchedUser.class.code });
    if (!myClass) {
      throw new Error("Class with that class code doesn't exist");
    }

    return myClass;
  },
};

// Get tasks by class code
const getTasksByClass = {
  type: GraphQLList(TaskType),
  resolve: async (_, __, ctx) => {
    const fetchedUser = await isClassMember(ctx);
    const myClass = await Class.findOne({ code: fetchedUser.class.code });
    if (!myClass) {
      throw new Error("Class with that class code doesn't exist");
    }

    // Check if has outdated
    let outdated = [];
    myClass.tasks.forEach((task) => {
      const taskDate = new Date(task.date).setHours(0, 0, 0, 0);
      const now = new Date().setHours(0, 0, 0, 0);
      if (taskDate < now) {
        outdated.push(task.id);
      }
    });

    // If has outdated - remove
    if (outdated.length) {
      await myClass.updateOne({
        $pull: { tasks: { _id: { $in: outdated } } },
      });
    }

    return myClass.tasks;
  },
};

const getTaskByClass = {
  type: TaskType,
  args: {
    taskId: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: async (_, args, ctx) => {
    const fetchedUser = await isClassMember(ctx);
    const { taskId } = args;

    const myClass = await Class.findOne({ code: fetchedUser.class.code });
    if (!myClass) {
      throw new Error("Nie odnaleziono klasy o takim kodzie");
    }

    // Check if has outdated
    let outdated = [];
    myClass.tasks.forEach((task) => {
      const taskDate = new Date(task.date).setHours(0, 0, 0, 0);
      const now = new Date().setHours(0, 0, 0, 0);
      if (taskDate < now) {
        outdated.push(task.id);
      }
    });

    // If has outdated - remove
    if (outdated.length) {
      await myClass.updateOne({
        $pull: { tasks: { _id: { $in: outdated } } },
      });
    }

    // Fetch task
    const fetchedTask = myClass.tasks.find(
      (task) => task._id.toString() === taskId.toString()
    );

    if (!fetchedTask) {
      throw new Error("Zadanie o takim ID nie istnieje");
    }

    return fetchedTask;
  },
};

// Get notifications by class code
const getNotificationsByClass = {
  type: GraphQLList(NotificationType),
  resolve: async (_, __, ctx) => {
    const fetchedUser = await isClassMember(ctx);

    const myClass = await Class.findOne({ code: fetchedUser.class.code });
    if (!myClass) {
      throw new Error("Class with that class code doesn't exist");
    }

    // Check if has outdated
    let outdated = [];
    myClass.notifications.forEach((notification) => {
      const notificationDate = new Date(notification.date).setHours(0, 0, 0, 0);
      const now = new Date().setHours(0, 0, 0, 0);
      if (notificationDate < now) {
        outdated.push(notification.id);
      }
    });

    // If has outdated - remove
    if (outdated.length) {
      await myClass.updateOne({
        $pull: { notifications: { _id: { $in: outdated } } },
      });
    }

    const sortedNotifications = myClass.notifications.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    return sortedNotifications;
  },
};

const getNotificationByClass = {
  type: NotificationType,
  args: {
    notificationId: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: async (_, args, ctx) => {
    const fetchedUser = await isClassMember(ctx);

    const { notificationId } = args;

    const myClass = await Class.findOne({ code: fetchedUser.class.code });
    if (!myClass) {
      throw new Error("Class with that class code doesn't exist");
    }

    // Check if has outdated
    let outdated = [];
    myClass.notifications.forEach((notification) => {
      const notificationDate = new Date(notification.date).setHours(0, 0, 0, 0);
      const now = new Date().setHours(0, 0, 0, 0);
      if (notificationDate < now) {
        outdated.push(notification.id);
      }
    });

    // If has outdated - remove
    if (outdated.length) {
      await myClass.updateOne({
        $pull: { notifications: { _id: { $in: outdated } } },
      });
    }

    const fetchedNotification = myClass.notifications.find(
      (notifications) =>
        notifications._id.toString() === notificationId.toString()
    );

    if (!fetchedNotification) {
      throw new Error("Notification with that id doesn't exist");
    }

    return fetchedNotification;
  },
};

// Get class members
const getClassMembers = {
  type: GraphQLList(UserType),
  resolve: async (_, __, ctx) => {
    const fetchedUser = await isClassMember(ctx);

    const myClass = await Class.findOne({ code: fetchedUser.class.code });
    if (!myClass) {
      throw new Error("Class with that class code doesn't exist");
    }

    const members = await User.find({ _id: { $in: myClass.users } });

    return members;
  },
};

module.exports = {
  getClassMembers,
  getClassByCode,
  getTasksByClass,
  getTaskByClass,
  getNotificationsByClass,
  getNotificationByClass,
};
