const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 30,
    minlength: 2,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: 'ObjectId',
    required: true
  },
  likes: {
    type: 'array',
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('card', cardSchema);