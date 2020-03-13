const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now()
  },
  cloudinaryPublicId: {
    type: String
  },
  isVideo: {
    type: Boolean,
    default: true
  },
  created: {
    type: Date,
    default: Date.now()
  }
});

const Entry = mongoose.model("Entry", schema);

module.exports = Entry;
