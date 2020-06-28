const graphql = require("graphql");
const Task = require("../../models/Task");
const Class = require("../../models/Class");
const User = require("../../models/User");
const { getRandomColor } = require("../../helpers/helpers");
const { isAuth, isClassAdmin } = require("../../helpers/authHelpers");

// Object Types
const { TaskType } = require("../objectTypes");

const { GraphQLString, GraphQLID, GraphQLNonNull } = graphql;

// Create new class task
const createTask = {
  type: TaskType,
  args: {
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    date: { type: GraphQLString }
  },
  resolve: async (_, args, ctx) => {
    const fetchedUser = await isClassAdmin(ctx);

    const { title, description, date } = args;
    if (!title || !date) {
      throw new Error(
        "Błąd podczas tworzenia zadania: proszę podać wszystkie dane"
      );
    }

    const newTask = new Task({
      title,
      description,
      date,
      color: getRandomColor()
    });

    const myClass = await Class.findOneAndUpdate(
      { code: fetchedUser.class.code },
      { $push: { tasks: newTask } },
      { useFindAndModify: false }
    );

    if (!myClass) {
      throw new Error("Nie znaleziono klasy o takim kodzie");
    }

    return newTask;
  }
};

// Delete task
const deleteTask = {
  type: TaskType,
  args: {
    taskId: { type: new GraphQLNonNull(GraphQLID) }
  },
  resolve: async (_, args, ctx) => {
    const fetchedUser = await isClassAdmin(ctx);

    const { taskId } = args;
    if (!taskId) {
      throw new Error("Błąd przy usuwaniu zadania - podaj id zadania");
    }

    const myClass = await Class.findOneAndUpdate(
      { code: fetchedUser.class.code },
      {
        $pull: { tasks: { _id: taskId } }
      },
      { useFindAndModify: false, new: true }
    );

    if (!myClass) {
      throw new Error("Błąd przy usuwaniu zadania - klasa nie istnieje");
    }

    const deletedTask = myClass.tasks.find(
      task => task._id.toString() === taskId
    );

    return deletedTask;
  }
};

// Edit task
const editTask = {
  type: TaskType,
  args: {
    taskId: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    date: { type: GraphQLString }
  },
  resolve: async (_, args, ctx) => {
    const fetchedUser = await isClassAdmin(ctx);

    const { title, description, date, taskId } = args;

    const myClass = await Class.findOneAndUpdate(
      { "tasks._id": taskId, code: fetchedUser.class.code },
      {
        $set: {
          "tasks.$.title": title,
          "tasks.$.description": description,
          "tasks.$.date": date
        }
      },
      { useFindAndModify: false, new: true }
    );

    if (!myClass) {
      throw new Error(
        "Create Task Error: Invalid class code - class with that code doesn't exist"
      );
    }

    const editedTask = myClass.tasks.find(
      task => task._id.toString() === taskId
    );

    return editedTask;
  }
};

// - - - - - - - - - - - -
// User's tasks mutations
// - - - - - - - - - - - -

// Create new task
const createUserTask = {
  type: TaskType,
  args: {
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    date: { type: GraphQLString }
  },
  resolve: async (_, args, ctx) => {
    isAuth(ctx);

    const { title, description, date } = args;
    if (!title || !date) {
      throw new Error("Błąd podczas tworzenia zadania: podaj wszystkie dane");
    }

    const newTask = new Task({
      title,
      description,
      date,
      color: getRandomColor()
    });

    const myUser = await User.findOneAndUpdate(
      { _id: ctx.user.id },
      { $push: { tasks: newTask } },
      { new: true, useFindAndModify: false }
    );

    if (!myUser) {
      throw new Error(
        "Błąd podczas tworzenia zadania: użytkownik o takim id nie istnieje"
      );
    }

    const createdTask = myUser.tasks.find(
      task => task._id.toString() === newTask._id.toString()
    );

    return createdTask;
  }
};

// Delete task
const deleteUserTask = {
  type: TaskType,
  args: {
    taskId: { type: GraphQLID }
  },
  resolve: async (_, args, ctx) => {
    isAuth(ctx);

    const { taskId } = args;

    if (!taskId) {
      throw new Error("Błąd podczas usuwania zadania - brak id zadania");
    }

    const myUser = await User.findOneAndUpdate(
      { _id: ctx.user.id },
      {
        $pull: { tasks: { _id: taskId } }
      },
      { useFindAndModify: false }
    );

    if (!myUser) {
      throw new Error(
        "Błąd podczas usuwania zadania - użytkownik nie istnieje"
      );
    }

    const deletedTask = myUser.tasks.find(
      task => task._id.toString() === taskId.toString()
    );

    return deletedTask;
  }
};

// Edit task
const editUserTask = {
  type: TaskType,
  args: {
    taskId: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    date: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async (_, args, ctx) => {
    isAuth(ctx);

    const { title, description, date, taskId } = args;

    const myUser = await User.findOneAndUpdate(
      { _id: ctx.user.id, "tasks._id": taskId },
      {
        $set: {
          "tasks.$.title": title,
          "tasks.$.description": description,
          "tasks.$.date": date
        }
      },
      { useFindAndModify: false, new: true }
    );

    if (!myUser) {
      throw new Error(
        "Błąd podczas edycji zadania - nie odnalezono użytkownika o takim id"
      );
    }

    const editedTask = myUser.tasks.find(
      task => task._id.toString() === taskId
    );

    return editedTask;
  }
};

module.exports = {
  createUserTask,
  deleteUserTask,
  editUserTask,
  deleteTask,
  createTask,
  editTask
};
