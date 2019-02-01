const router = require("express").Router();
const User = require("../models/UserModel");
const { userService } = require("../services");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/register", (req, res) => {
  res.render("register");
});

// router.get("/chat", (req, res) => {
//   User.find({})
//   .then(users => {
//     console.log(users,req.body)
//    res.render('chat', {
//     users: users
//      });
//   })
// });

router.post("/chat", async (req, res) => {
  const { name, room , userId } = req.body;
  console.log(name, room, userId);
  User.findByIdAndUpdate(userId, {name: name, room:room })
  .then(user => {
   res.render('chat', {
    user: user
     });
  })
});


router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await userService.getUser(username, password);
  
  if (user && user.id) {
    req.session.userId = user.id;
    res.render('login', {
      userId: user.id
    });
  } else {
    res.status(401).end("invalid credentials");
  }
//  console.log(user.id);
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password });
  const savedUser = await userService.saveUser(user);
  req.session.userId = savedUser.id;
  res.render('login', {
    userId: user.id
  });
});

module.exports = router;
