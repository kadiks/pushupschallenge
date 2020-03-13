const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const bcrypt = require("bcrypt");

const schema = new mongoose.Schema({
  username: {
    type: String
  },
  password: {
    type: String
  }
});

schema.plugin(passportLocalMongoose);

schema.methods.verifyPassword = function(password) {
  console.log("typeof password", typeof password);
  console.log("password.length", password.length);
  console.log("typeof this.password", typeof this.password);
  console.log("this.password.length", this.password.length);
  return this.password === this.hashPassword(password);
};

module.exports = mongoose.model("User", schema);
