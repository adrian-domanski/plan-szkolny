const schedule = require("node-schedule");
const User = require("../models/User");
const Class = require("../models/Class");

// Clear all uncomfirmed accounts

const clearAccountsSchedule = () =>
  schedule.scheduleJob({ hour: 4, minute: 0, dayOfWeek: 0 }, async () => {
    const uncomfirmedUsers = await User.find({ confirmed: false });

    const uncomfirmedUsersIds = uncomfirmedUsers.map((user) => user._id);

    await Class.updateMany(
      { users: { $in: uncomfirmedUsersIds } },
      { $pull: { users: { $in: uncomfirmedUsersIds } } },
      { useFindAndModify: false }
    );

    await User.deleteMany({ _id: { $in: uncomfirmedUsersIds } });
  });

module.exports = {
  clearAccountsSchedule,
};
