const User = require("../models/User");

const isAuth = ctx => {
  if (!ctx.user) {
    throw new Error("Odmowa dostępu");
  }
};

const isClassMember = async ctx => {
  isAuth(ctx);
  const fetchedUser = await ctx.loaders.userByIds.load(ctx.user.id);
  if (!fetchedUser) {
    throw new Error("Nie znaleziono użytkownika");
  }
  if (!fetchedUser.class.code) {
    throw new Error("Nie jesteć członkiem klasy");
  }

  return fetchedUser;
};

const isClassAdmin = async ctx => {
  isAuth(ctx);
  const fetchedUser = await ctx.loaders.userByIds.load(ctx.user.id);
  if (!fetchedUser) {
    throw new Error("Nie znaleziono użytkownika");
  }
  if (
    fetchedUser.class.rank === "admin" ||
    fetchedUser.class.rank === "owner"
  ) {
    return fetchedUser;
  } else {
    throw new Error("Odmowa dostępu");
  }
};

const isClassOwner = async ctx => {
  isAuth(ctx);
  const fetchedUser = await ctx.loaders.userByIds.load(ctx.user.id);
  if (!fetchedUser) {
    throw new Error("Nie znaleziono użytkownika");
  }
  if (fetchedUser.class.rank === "owner") {
    return fetchedUser;
  } else {
    throw new Error("Odmowa dostępu");
  }
};

module.exports = {
  isClassAdmin,
  isClassOwner,
  isAuth,
  isClassMember
};
