const express = require("express");
const path = require("path");
const session = require("express-session");
const { todoController, homeController } = require("./controllers");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: "very secret", // never save the production secret in your repo
    resave: false,
    saveUninitialized: true
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", homeController, todoController);


module.exports = app;
