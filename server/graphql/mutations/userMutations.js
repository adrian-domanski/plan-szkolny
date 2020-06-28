const graphql = require("graphql");
const User = require("../../models/User");
const Image = require("../../models/Image");
const Class = require("../../models/Class");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const path = require("path");
const { isAuth } = require("../../helpers/authHelpers");

// Object Types
const {
  UserType,
  LoginType,
  MessageType,
  ImageType,
} = require("../objectTypes");

const { GraphQLUpload } = require("graphql-upload");
const { GraphQLString, GraphQLNonNull } = graphql;

// Aws - user avatar
const AWS = require("aws-sdk");
AWS.config.update(config.get("awsConfig"));
const s3 = new AWS.S3();

// Register
const createUser = {
  type: LoginType,
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    surname: { type: new GraphQLNonNull(GraphQLString) },
    classCode: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(_, args, ctx) {
    const { name, surname, classCode, email, password } = args;
    if (!email || !password || !name || !surname) {
      throw new Error("Proszę podać wszystkie dane");
    }
    // Check if user exist
    const fetchedUser = await User.findOne({ email });
    if (fetchedUser)
      throw Error("Użytkownik z takim adresem e-mail już istnieje");
    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 12);

    // Check if class with that code exist
    let myClass = null;
    if (classCode) {
      myClass = await Class.findOne({ code: classCode });
      if (!myClass) throw Error("Nie znaleziono klasy o takim kodzie");
    }

    const newUser = new User({
      name,
      surname,
      class: {
        code: classCode,
        rank: classCode ? "member" : "",
      },
      email,
      password: hashedPassword,
    });
    const user = await newUser.save();

    if (myClass) {
      // Add user to class members list
      await myClass.updateOne({ $push: { users: newUser._id } });
    }

    const token = jwt.sign({ userId: user.id }, config.get("jwtSecret"), {
      expiresIn: "1d",
    });

    // Send confirm email
    const emailToken = jwt.sign(
      { userId: user.id, type: "REGISTER_CONFIRM" },
      config.get("jwtSecret"),
      { expiresIn: "1d" }
    );
    const url = `${
      process.env.NODE_ENV !== "production"
        ? "http://localhost:5000"
        : "https://api.plan-szkolny.pl"
    }/confirm/email/${emailToken}`;

    ctx.transporter.sendMail({
      to: email,
      subject: "Potwierdzenie adresu email",
      html: `
      <!DOCTYPE html>
      <html lang="pl">
      <head>
        <meta charset="UTF-8"/>
      </head>
      <body>
        <h1>Witaj ${name}!</h1>
        <p>Dziękujemy za rejestrację w naszym serwisie. W celu weryfikacji adresu email kliknij w poniższy link.</p>
        
        <h2 style="margin:0">Link aktywacyjny:</h2><br/>
        <a href="${url}">${url}</a><br/><br/>
        <b>Miłego dnia!</b>
      </body>
      </html>
      `,
    });

    return {
      userId: user.id,
      token,
    };
  },
};

const updateUser = {
  type: UserType,
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    surname: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(_, args, ctx) {
    const { name, surname } = args;
    const updatedUser = User.findOneAndUpdate(
      { _id: ctx.user.id },
      { name, surname },
      { new: true, useFindAndModify: false }
    );
    return updatedUser;
  },
};

const deleteUser = {
  type: UserType,
  async resolve(_, __, ctx) {
    return User.findByIdAndDelete(ctx.user.id);
  },
};

// - - - - - - -
// User's Avatar
// - - - - - - -

// Upload user avatar
const uploadUserAvatar = {
  type: ImageType,
  args: {
    image: { type: GraphQLUpload },
  },
  resolve: async (_, args, ctx) => {
    const { filename, createReadStream } = await args.image;

    const fetchedUser = await User.findOne({ _id: ctx.user.id });
    if (!fetchedUser) throw new Error("Nie odnaleziono użytkownika o takim id");

    const stream = createReadStream();

    const uploadParams = {
      Bucket: config.get("awsBucket"),
      Key: `users/user-${ctx.user.id}/avatar.jpg`,
      Body: stream,
    };
    const awsRes = await s3.upload(uploadParams).promise();

    // SAVE URL TO DATABASE
    const newImage = new Image({
      filename: awsRes.Key,
      url: awsRes.Location,
    });

    await fetchedUser.updateOne({ avatar: newImage });

    return newImage;
  },
};

// Delete user avatar
const deleteUserAvatar = {
  type: ImageType,
  resolve: async (_, __, ctx) => {
    const fetchedUser = await User.findOneAndUpdate(
      { _id: ctx.user.id },
      { $unset: { avatar: 1 } },
      { useFindAndModify: false }
    );

    if (!fetchedUser) throw new Error("Nie znaleziono użytkownika o takim id");
    if (!fetchedUser.avatar.filename)
      throw new Error("Ten użytkonik nie posiada avatara");

    const deleteParams = {
      Bucket: config.get("awsBucket"),
      Key: fetchedUser.avatar.filename,
    };

    // Delete avatar
    await s3.deleteObject(deleteParams).promise();

    return {
      id: fetchedUser.avatar._id,
      filename: fetchedUser.avatar.filename,
      url: fetchedUser.avatar.url,
    };
  },
};

// Resent email
const resentEmailConfirm = {
  type: MessageType,
  args: {
    email: { type: GraphQLString },
  },
  resolve: async (_, args, ctx) => {
    isAuth(ctx);
    const { email } = args;

    const fetchedUser = await User.findOne({ _id: ctx.user.id });

    // Address already confirmed
    if (fetchedUser.confirmed) {
      throw new Error("Email został już potwierdzony");
    }

    if (fetchedUser.email !== email) {
      await fetchedUser.updateOne({ email });
    }

    // Send confirm email
    const emailToken = jwt.sign(
      { userId: fetchedUser.id, type: "REGISTER_CONFIRM" },
      config.get("jwtSecret"),
      { expiresIn: "1d" }
    );
    const url = `${
      process.env.NODE_ENV !== "production"
        ? "http://localhost:5000"
        : "https://api.plan-szkolny.pl"
    }/confirm/email/${emailToken}`;

    ctx.transporter.sendMail({
      to: email,
      subject: "Potwierdzenie adresu email",
      html: `
      <!DOCTYPE html>
      <html lang="pl">
      <head>
        <meta charset="UTF-8"/>
      </head>
      <body>
        <h1>Witaj ${fetchedUser.name}!</h1>
        <p>Twoje konto zostało pomyślnie utworzone, aby rozpocząć korzystanie z naszego serwisu niezbędne jest potwierdzenie adresu email podanego podczas procesu rejestracji. Kliknij w poniższy link aktywacyjny aby przejść dalej.</p>
        
        <h2 style="margin:0">Link aktywacyjny:</h2><br/>
        <a href="${url}">${url}</a><br/><br/>
        <b>Dziękujemy i życzymy miłej nauki!</b>
      </body>
      </html>
      `,
    });

    return {
      msg: "Wiadomość została wysłana",
    };
  },
};

// Change password
const changePassword = {
  type: UserType,
  args: {
    newPassword: { type: GraphQLString },
    token: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args, ctx) => {
    isAuth(ctx);
    const decoded = jwt.verify(args.token, config.get("jwtSecret"));
    if (
      !decoded ||
      !decoded.userId ||
      !decoded.type ||
      decoded.type !== "REMIND_PASSWORD"
    ) {
      throw new Error("Błąd podczas zmiany hasła - niepoprawny token");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(args.newPassword, 12);

    // Update user
    const myUser = await User.findOneAndUpdate(
      { _id: decoded.userId },
      { password: hashedPassword },
      { new: true, useFindAndModify: false }
    );

    return myUser;
  },
};

// Change email

module.exports = {
  changePassword,
  resentEmailConfirm,
  updateUser,
  deleteUserAvatar,
  uploadUserAvatar,
  createUser,
  deleteUser,
};
