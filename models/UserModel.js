const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: 'user',
    required: true
  },
  room: {
    type: String,
    default: 'home',
    required: true
  }
});

module.exports = mongoose.model("User", User);
