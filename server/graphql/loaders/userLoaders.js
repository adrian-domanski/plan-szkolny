const DataLoader = require("dataloader");
const User = require("../../models/User");

// User by ids
const userByIdsLoader = () => new DataLoader(keys => batchUsersByIds(keys));
const batchUsersByIds = async keys => {
  const users = await User.find({ _id: { $in: keys } }).select("--password");

  return keys.map(key => users.find(user => user.id === key.toString()));
};

module.exports = {
  userByIdsLoader
};
