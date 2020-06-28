const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Task = require("./Task");
const Image = require("./Image");

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  confirmed: {
    type: Boolean,
    default: false
  },
  class: {
    code: { type: String },
    rank: { type: String }
  },
  tasks: {
    type: [Task.schema],
    default: []
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: Image.schema
  }
});

module.exports = mongoose.model("user", userSchema);
