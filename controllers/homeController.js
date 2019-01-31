const router = require("express").Router();
const User = require("../models/UserModel");
const { userService } = require("../services");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/chat", async (req, res) => {
  const { username, password } = req.body;
  const user = await userService.getUser(username, password);
console.log(req.body);
  if (user && user.id) {
    req.session.userId = user.id;
    User.find({})
    .then(users => {
     res.render('chat', {
      users: users
       });
    })
  } else {
    res.status(401).end("invalid credentials");
  }
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password });
  const savedUser = await userService.saveUser(user);
  req.session.userId = savedUser.id;
  res.render("chat");
});

module.exports = router;
