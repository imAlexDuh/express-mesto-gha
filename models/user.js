const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 30,
    minlength: 2,
  },
  about: {
    type: String,
    required: true,
    maxLength: 30,
    minlength: 2,
  },
  avatar: {
    type: String,
    required: true,
  }
})

module.exports = mongoose.model('user', userSchema);