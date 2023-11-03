const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const SECRET = 'secretkey';

// eslint-disable-next-line consistent-return

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SECRET, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      res.status(401).send({ message: 'Неправильные почта или пароль.' });
    });
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные.' });
      }
      res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (users.length === 0) {
        res.status(404).send({ message: 'Пользователи не найдены' });
        return;
      }
      res.status(200).send(users);
    })

    .catch(() => {
      res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь по указанному id не найден' });
        return;
      }
      res.status(200).send(user);
    })

    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные.' });
      }
      res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};

const postUsers = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: 'Поля email и password обязательны' });
  }

  return bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, about, avatar, email: req.body.email, password: hash,
    }))
    .then((user) => {
      res.status(200).send({
        name: user.name, about: user.about, avatar: user.avatar, _id: user._id, email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new 400('Переданы некорректные данные при создании пользователя'));
      }
      if (err.code === 11000) {
        return next(new 400('Передан уже зарегистрированный email.'));
      }
      return next(err);
    });
};

const updateUserProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) { return res.status(404).send({ message: 'Пользователь не найден' }); }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') { return res.status(400).send({ message: 'Переданы некорректные данные.' }); }
      return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};

const patchMeAvatar = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) { return res.status(404).send({ message: 'Пользователь с указанным id не найден.' }); }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') { return res.status(400).send({ message: 'Переданы некорректные данные.' }); }
      return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  postUsers,
  updateUserProfile,
  patchMeAvatar,
  login,
  getCurrentUser,
};
