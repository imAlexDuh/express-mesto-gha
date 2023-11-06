/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const BadAuthErr = require('../errors/BadAuthErr');
const ExistingEmailErr = require('../errors/ExistingEmailErr');
const NotExistErr = require('../errors/NotExistErr');
const BadRequestErr = require('../errors/BadRequestErr');

const SECRET = 'secretkey';
const ROUND = 10;

// eslint-disable-next-line consistent-return

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SECRET, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      next(new BadAuthErr('Неправильные почта или пароль.'));
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotExistErr('Пользователь по указанному не найден.'));
      }
      return res.status(200).send(user);
    })
    .catch((err) => next(err));
};

const postUsers = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    return res.status(BadRequestErr).send({ message: 'Поля email и password обязательны' });
  }

  return bcrypt.hash(req.body.password, ROUND)
    .then((hash) => User.create({
      name, about, avatar, email: req.body.email, password: hash,
    }))
    .then((user) => {
      res.status(201).send({
        name: user.name, about: user.about, avatar: user.avatar, _id: user._id, email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestErr('Переданы некорректные данные при создании пользователя'));
      }
      if (err.code === 11000) {
        return next(new ExistingEmailErr('Передан уже зарегистрированный email.'));
      }
      return next(err);
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((result) => res.send(result))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ user });
      } else {
        throw new NotExistErr('Ошибка. Пользователь не найден, попробуйте еще раз');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestErr('Ошибка. Введен некорректный id пользователя'));
      }
      return next(err);
    });
};

const updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return next(new NotExistErr('Пользователь по указанному _id не найден.'));
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestErr('Переданы некорректные данные при обновлении пользователя'));
      }
      return next(err);
    });
};

const patchMeAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new NotExistErr('Пользователь по указанному _id не найден.'));
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestErr('Переданы некорректные данные при обновлении пользователя'));
      }
      if (err.name === 'CastError') {
        return next(new NotExistErr('Пользователь по указанному _id не найден.'));
      }
      return next(err);
    });
};

module.exports = {
  getUsers,
  getCurrentUser,
  getUserById,
  postUsers,
  updateUserProfile,
  patchMeAvatar,
  login,
};
