const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Task = require("./Task");
const Notification = require("./Notification");
const Image = require("./Image");
const Message = require("./Message");

const classSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  replacements: {
    type: {
      replacementsToday: String,
      replacementsTomorrow: String,
      replacementsDayAfter: String
    }
  },
  tasks: {
    type: [Task.schema],
    default: []
  },
  notifications: {
    type: [Notification.schema],
    default: []
  },
  messages: {
    type: [Message.schema],
    default: []
  },
  owner: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  users: {
    type: [mongoose.Types.ObjectId],
    required: true
  },
  plan: {
    type: Image.schema
  }
});

module.exports = mongoose.model("class", classSchema);
