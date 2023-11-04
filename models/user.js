const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');

const {
  ERROR_BAD_AUTH,
} = require('../errors/BadAuthError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    maxLength: 30,
    minlength: 2,
  },
  about: {
    type: String,
    default: 'Исследователь',
    maxLength: 30,
    minlength: 2,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => isEmail(value),
      message: 'Некорректный email',
    },
  },
  password: {
    type: String,
    select: false,
    required: true,
  },
});

userSchema.statics.findUserByCredentials = function findUser(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new ERROR_BAD_AUTH('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new ERROR_BAD_AUTH('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
