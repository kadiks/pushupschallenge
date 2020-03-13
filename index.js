require("dotenv").config();

// imports
const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const UserModel = require("./models/User");
const entryRouter = require("./controllers/entry");
const userRouter = require("./controllers/user");

const PORT = process.env.PORT || 3000;

// DB config
mongoose.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  err => {
    if (err) {
      console.log("Database connection error", err);
      return;
    }
    console.log("Database connected");
  }
);

// Express configs
const app = express();

// Passport & sessions
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

passport.use(
  new LocalStrategy(function(username, password, done) {
    UserModel.findOne({ username: username }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      // TODO
      if (!user.verifyPassword(password)) {
        return done(null, false);
      }
      return done(null, user);
    });
  })
);

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(UserModel.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

app.use(passport.initialize());
app.use(passport.session());

// Handlebars
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

// Routes
app.use("/", entryRouter);
app.use("/", userRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
