const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  msg: {
    type: String,
    require: true
  },
  author: {
    type: mongoose.Types.ObjectId,
    require: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("message", messageSchema);
