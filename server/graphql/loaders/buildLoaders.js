const userLoaders = require("./userLoaders");
const classLoaders = require("./classLoaders");

const buildLoaders = () => ({
  userByIds: userLoaders.userByIdsLoader(),
  classByCodes: classLoaders.classByCodes()
});

module.exports = buildLoaders;
