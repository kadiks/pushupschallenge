const router = require("express").Router();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const UserModel = require("../models/User");

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", (req, res) => {
  //   console.log("#1");
  const { username, password } = req.body;
  UserModel.register(
    {
      username
    },
    password,
    (err, user) => {
      //   console.log("#2");
      if (err) {
        console.log("User register failed", err);
        res.redirect("/signup");
        return;
      }
      //   console.log("#3");
      res.redirect("/login");
    }
  );
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);

router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
