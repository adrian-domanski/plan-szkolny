const Class = require("../../models/Class");
const User = require("../../models/User");
const Image = require("../../models/Image");
const graphql = require("graphql");
const shortId = require("shortid");
const config = require("config");
const path = require("path");
const { GraphQLUpload } = require("graphql-upload");
const { emptyS3Directory } = require("../../helpers/helpers");
const { ClassType, ImageType, UserType } = require("../objectTypes");
const {
  isAuth,
  isClassAdmin,
  isClassOwner,
} = require("../../helpers/authHelpers");

const { GraphQLString, GraphQLNonNull, GraphQLID } = graphql;

const AWS = require("aws-sdk");
AWS.config.update(config.get("awsConfig"));
const s3 = new AWS.S3();

// Update replacements
const updateReplacements = {
  type: ClassType,
  args: {
    today: { type: GraphQLString },
    tomorrow: { type: GraphQLString },
    dayAfter: { type: GraphQLString },
    page: { type: GraphQLString },
  },
  resolve: async (_, args, ctx) => {
    const fetchedUser = await isClassAdmin(ctx);

    const { today, tomorrow, dayAfter, page } = args;

    const myClass = await Class.findOneAndUpdate(
      { code: fetchedUser.class.code },
      {
        "replacements.today": today,
        "replacements.tomorrow": tomorrow,
        "replacements.dayAfter": dayAfter,
        "replacements.page": page,
      },
      { useFindAndModify: false, new: true }
    );

    if (!myClass) {
      throw new Error("Nie odnaleziono klasy o takim kodzie");
    }

    if (!today && !tomorrow && !dayAfter && !page) {
      await myClass.updateOne({ $unset: { replacements: 1 } });
    }

    return myClass;
  },
};

// Upload school plan
const uploadPlan = {
  type: ImageType,
  args: {
    image: { type: GraphQLUpload },
  },
  resolve: async (_, args, ctx) => {
    // If auth && admin
    const fetchedUser = await isClassAdmin(ctx);

    const { filename, createReadStream } = await args.image;

    const myClass = await Class.findOne({ code: fetchedUser.class.code });
    if (!myClass) throw new Error("Class with that code doesnt exist");

    const stream = createReadStream();

    const uploadParams = {
      Bucket: config.get("awsBucket"),
      Key: `classes/class-${fetchedUser.class.code}/lesson-plan${
        path.parse(filename).ext
      }`,
      Body: stream,
    };
    const awsRes = await s3.upload(uploadParams).promise();

    // SAVE URL TO DATABASE
    const newImage = new Image({
      filename: awsRes.Key,
      url: awsRes.Location,
    });

    await myClass.updateOne({ plan: newImage });

    return newImage;
  },
};

// Delete school plan
const deletePlan = {
  type: ImageType,
  resolve: async (_, __, ctx) => {
    // If auth && admin
    const fetchedUser = await isClassAdmin(ctx);

    const myClass = await Class.findOneAndUpdate(
      { code: fetchedUser.class.code },
      { $unset: { plan: 1 } },
      { useFindAndModify: false }
    );

    if (!myClass) throw new Error("Class with that class code doesnt exist");
    if (!myClass.plan.filename)
      throw new Error("This class hasn't got any plan");

    const deleteParams = {
      Bucket: config.get("awsBucket"),
      Key: myClass.plan.filename,
    };

    // Delete plan
    await s3.deleteObject(deleteParams).promise();

    return {
      id: myClass.plan._id,
      filename: myClass.plan.filename,
      url: myClass.plan.url,
    };
  },
};

// Class
const createClass = {
  type: ClassType,
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(_, args, ctx) {
    isAuth(ctx);

    const { name } = args;
    const code = shortId.generate();
    const newClass = new Class({
      code,
      name,
      owner: ctx.user.id,
      users: [ctx.user.id],
    });

    await User.findOneAndUpdate(
      { _id: ctx.user.id },
      { "class.code": code, "class.rank": "owner" },
      { useFindAndModify: false }
    );

    const createdClass = await newClass.save();
    return createdClass;
  },
};

const deleteClass = {
  type: ClassType,
  async resolve(_, __, ctx) {
    // If auth && admin
    const fetchedUser = await isClassOwner(ctx);

    const myClass = await Class.findOneAndDelete(
      {
        code: fetchedUser.class.code,
      },
      { useFindAndModify: false }
    );

    if (myClass) {
      // Remove classcode from all users that were in class
      await User.updateMany(
        { "class.code": myClass.code },
        { "class.code": "", "class.rank": "" }
      );

      // Delete class directory
      await emptyS3Directory(
        s3,
        config.get("awsBucket"),
        `classes/class-${myClass.code}`
      );
    }

    return myClass;
  },
};

const addUserToClass = {
  type: ClassType,
  args: {
    code: { type: new GraphQLNonNull(GraphQLID) },
    className: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args, ctx) => {
    isAuth(ctx);
    const { code, className } = args;

    // Find class
    const myClass = await Class.findOne({ code });

    // Check if class exist  && correct credentials
    if (!myClass || myClass.name !== className)
      throw new Error("Niepoprawna nazwa i/lub kod klasy");
    if (myClass.users.includes(ctx.user.id))
      throw new Error("Jesteś już członkiem tej klasy");

    // Add user to class
    await myClass.updateOne({ $push: { users: ctx.user.id } });

    // Update user's class code
    await User.findOneAndUpdate(
      { _id: ctx.user.id },
      { "class.code": code, "class.rank": "member" },
      { useFindAndModify: false }
    );

    return myClass;
  },
};

const leaveClass = {
  type: ClassType,
  resolve: async (_, __, ctx) => {
    isAuth(ctx);
    const fetchedUser = await User.findOne({ _id: ctx.user.id });
    const myClass = await Class.findOneAndUpdate(
      { code: fetchedUser.class.code },
      { $pull: { users: ctx.user.id } },
      { new: true, useFindAndModify: false },
      (_, myClass) => {
        if (!myClass) console.log("Taka klasa nie istnieje");
      }
    );

    // Clear user's class code
    await User.findOneAndUpdate(
      { _id: ctx.user.id },
      { "class.code": "", "class.rank": "" },
      { useFindAndModify: false }
    );
    return myClass;
  },
};

const deleteUserFromClass = {
  type: UserType,
  args: {
    userId: { type: GraphQLID },
  },
  resolve: async (_, args, ctx) => {
    const owner = await isClassOwner(ctx);
    await Class.findOneAndUpdate(
      { code: owner.class.code },
      { $pull: { users: args.userId } },
      { new: true, useFindAndModify: false }
    );

    // Clear user's class code
    const updatedUser = await User.findOneAndUpdate(
      { _id: args.userId },
      { "class.code": "", "class.rank": "" },
      { useFindAndModify: false, new: true }
    );

    return updatedUser;
  },
};

const makeUserAdmin = {
  type: UserType,
  args: {
    userId: { type: GraphQLID },
  },
  resolve: async (_, args, ctx) => {
    await isClassOwner(ctx);

    const updatedUser = await User.findOneAndUpdate(
      { _id: args.userId },
      { "class.rank": "admin" },
      { new: true }
    );

    if (!updatedUser) throw new Error("Nie odnaleziono użytkownika o takim ID");

    return updatedUser;
  },
};

const makeUserMember = {
  type: UserType,
  args: {
    userId: { type: GraphQLID },
  },
  resolve: async (_, args, ctx) => {
    await isClassOwner(ctx);

    const updatedUser = await User.findOneAndUpdate(
      { _id: args.userId },
      { "class.rank": "member" },
      { new: true }
    );

    if (!updatedUser) throw new Error("Nie odnaleziono użytkownika o takim ID");

    return updatedUser;
  },
};

const changeClassName = {
  type: ClassType,
  args: {
    newClassName: { type: GraphQLString },
  },
  resolve: async (_, args, ctx) => {
    const fetchedUser = await isClassOwner(ctx);

    const updatedClass = await Class.findOneAndUpdate(
      { code: fetchedUser.class.code },
      { name: args.newClassName },
      { useFindAndModify: false }
    );

    return updatedClass;
  },
};

const generateNewClassCode = {
  type: ClassType,
  resolve: async (_, __, ctx) => {
    const fetchedUser = await isClassOwner(ctx);

    const newClassCode = shortId.generate();

    // Change class code
    const myClass = await Class.findOneAndUpdate(
      { code: fetchedUser.class.code },
      { code: newClassCode },
      { useFindAndModify: false }
    );

    // Update members class code
    await User.updateMany(
      { "class.code": myClass.code },
      { "class.code": newClassCode }
    );

    return myClass;
  },
};

module.exports = {
  updateReplacements,
  deletePlan,
  uploadPlan,
  createClass,
  deleteClass,
  addUserToClass,
  leaveClass,
  makeUserAdmin,
  makeUserMember,
  deleteUserFromClass,
  changeClassName,
  generateNewClassCode,
};
