const server = require("./index.js");
const mongoose = require("mongoose");

const DB_URI = process.env.MONGO_DB_URI
  ? process.env.MONGO_DB_URI
  : "mongodb://localhost:27017/chat-app";

mongoose.connect(DB_URI);
server.listen(3000);
