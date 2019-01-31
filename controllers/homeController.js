const router = require("express").Router();
const User = require("../models/UserModel");
const { userService } = require("../services");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/chat", (req, res) => {
  User.find({})
  .then(users => {
   res.render('chat', {
    users: users
     });
  })
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await userService.getUser(username, password);
  console.log(user);
  
  if (user && user.id) {
    req.session.userId = user.id;
     res.render('login');
  } else {
    res.status(401).end("invalid credentials");
  }
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password });
  const savedUser = await userService.saveUser(user);
  req.session.userId = savedUser.id;
  res.render("login");
});

module.exports = router;
