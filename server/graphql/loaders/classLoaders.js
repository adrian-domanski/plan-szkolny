const DataLoader = require("dataloader");
const Class = require("../../models/Class");

// User by ids
const classByCodes = () => new DataLoader(keys => batchClassByCode(keys));
const batchClassByCode = async keys => {
  const classes = await Class.find({ code: { $in: keys } });

  return keys.map(key => classes.find(({ code }) => code === key.toString()));
};

module.exports = {
  classByCodes
};
