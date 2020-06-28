const graphql = require("graphql");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { isAuth } = require("../../helpers/authHelpers");

const { GraphQLNonNull, GraphQLString, GraphQLList, GraphQLID } = graphql;
const { LoginType, MessageType } = require("../objectTypes");

// Login
const login = {
  type: LoginType,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args) => {
    const { email, password } = args;
    const user = await User.findOne({ email }).select("--password");

    const isEqual = user && (await bcrypt.compare(password, user.password));
    if (!user || !isEqual) {
      throw new Error("Niepoprawny login i/lub hasło");
    }

    // Create token
    const token = jwt.sign({ userId: user.id }, config.get("jwtSecret"), {
      expiresIn: "3d",
    });

    return {
      userId: user.id,
      token,
    };
  },
};

// Auth user - return user based on token
const authUser = {
  type: LoginType,
  args: {
    token: { type: GraphQLString },
  },
  resolve: async (_, args, ctx) => {
    try {
      const decoded = jwt.verify(args.token, config.get("jwtSecret"));
      const myUser = await User.findOne({ _id: decoded.userId });
      if (decoded && decoded.userId) {
        return {
          userId: myUser.id,
          token: args.token,
        };
      }
    } catch (err) {
      throw err;
    }
  },
};

// Remind password
const remindPassword = {
  type: MessageType,
  args: {
    email: { type: GraphQLString },
  },
  resolve: async (_, args, ctx) => {
    const { email } = args;

    const fetchedUser = await User.findOne({ email });

    if (!fetchedUser) {
      throw new Error("Nie znaleziono użytkownika o takim adresie email");
    }

    // Create token
    const token = jwt.sign(
      { userId: fetchedUser._id, type: "REMIND_PASSWORD" },
      config.get("jwtSecret"),
      { expiresIn: "20m" }
    );

    // Send confirm email
    const url = `${
      process.env.NODE_ENV !== "production"
        ? "http://localhost:3000"
        : "https://plan-szkolny.pl"
    }/confirm/zmiana-hasla?token=${token}`;

    ctx.transporter.sendMail({
      to: email,
      subject: "Zmiana hasła",
      html: `
      <!DOCTYPE html>
      <html lang="pl">
      <head>
        <meta charset="UTF-8"/>
      </head>
      <body>
        <h1>Witaj ${fetchedUser.name}!</h1>
        <p>Otrzymaliśmy prośbę o zmianę hasła do twojego konta. Aby kontynuować kliknij w poniższy link.</p>
        
        <h2 style="margin:0">Zmiana hasła:</h2><br/>
        <a href="${url}">${url}</a><br/><br/>
        <b>Miłego dnia!</b>
      </body>
      </html>
      `,
    });

    return {
      msg: "Wysłano email",
    };
  },
};

// Change email info - first step

const sendChangeEmailInfo = {
  type: MessageType,
  resolve: async (_, __, ctx) => {
    isAuth(ctx);

    const fetchedUser = await User.findOne({ _id: ctx.user.id });

    if (!fetchedUser) {
      throw new Error("Nie znaleziono użytkownika o takim adresie email");
    }

    // Create token
    const token = jwt.sign(
      { userId: fetchedUser._id, type: "CHANGE_EMAIL_FIRST_STEP" },
      config.get("jwtSecret"),
      { expiresIn: "20m" }
    );

    // Send confirm email
    const url = `${
      process.env.NODE_ENV !== "production"
        ? "http://localhost:3000"
        : "https://plan-szkolny.pl"
    }/confirm/zmiana-emaila?token=${token}`;

    ctx.transporter.sendMail({
      to: fetchedUser.email,
      subject: "Zmiana adresu email",
      html: `
      <!DOCTYPE html>
      <html lang="pl">
      <head>
        <meta charset="UTF-8"/>
      </head>
      <body>
        <h1>Witaj ${fetchedUser.name}!</h1>
        <p>Otrzymaliśmy prośbę o zmianę aktualnego adresu email. Aby kontynuować kliknij w poniższy link.</p>
        
        <h2 style="margin:0">Zmiana adresu email:</h2><br/>
        <a href="${url}">${url}</a><br/><br/>
        <b>Miłego dnia!</b>
      </body>
      </html>
      `,
    });

    return {
      msg: "Wysłano email",
    };
  },
};

// Change email - second step (send email to new address)

const sendChangeEmailToNewAddress = {
  type: MessageType,
  args: {
    firstStepToken: { type: GraphQLString },
    newEmail: { type: GraphQLString },
  },
  resolve: async (_, args, ctx) => {
    isAuth(ctx);
    const { newEmail, firstStepToken } = args;

    const decodedToken = jwt.verify(firstStepToken, config.get("jwtSecret"));
    if (
      !decodedToken ||
      !decodedToken.userId ||
      !decodedToken.type ||
      decodedToken.type !== "CHANGE_EMAIL_FIRST_STEP"
    ) {
      throw new Error("Niepoprawny token uwierzytelniający");
    }

    const fetchedUser = await User.findById(decodedToken.userId);
    if (!fetchedUser) {
      throw new Error("Nie odnaleziono użytkownika o takim id");
    }

    // Create token
    const newToken = jwt.sign(
      { userId: fetchedUser._id, newEmail, type: "CHANGE_EMAIL_SECOND_STEP" },
      config.get("jwtSecret"),
      { expiresIn: "20m" }
    );

    // Send confirm email
    const url = `${
      process.env.NODE_ENV !== "production"
        ? "http://localhost:3000"
        : "https://plan-szkolny.pl"
    }/confirm/new-email/${newToken}`;

    ctx.transporter.sendMail({
      to: newEmail,
      subject: "Potwierdź nowy adres email",
      html: `
      <!DOCTYPE html>
      <html lang="pl">
      <head>
        <meta charset="UTF-8"/>
      </head>
      <body>
        <h1>Witaj ${fetchedUser.name}!</h1>
        <p>Otrzymaliśmy prośbę o zmianę aktualnego adresu email. Aby potwierdzić nowy adres email kliknij w poniższy link.</p>
        
        <h2 style="margin:0">Zmiana adresu email:</h2><br/>
        <a href="${url}">${url}</a><br/><br/>
        <b>Miłego dnia!</b>
      </body>
      </html>
      `,
    });

    return {
      msg: "Wysłano email",
    };
  },
};

module.exports = {
  sendChangeEmailToNewAddress,
  sendChangeEmailInfo,
  remindPassword,
  login,
  authUser,
};
