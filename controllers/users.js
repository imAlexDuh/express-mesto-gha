const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (users.length === 0) {
        res.status(404).send({ message: "Пользователь не найдены" });
        return;
      }
      res.status(200).send(users);
    })
    .catch(() => {
      res.status(400).send({ message: `Переданы некорректные данные` });
      res.status(500).send({ message: `Внутренняя ошибка сервера` });
    })
};

const getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: `Пользователь по указанному id не найден` });
        return;
      }
      res.status(200).send(user);
    })
    .catch(() => {
      res.status(400).send({ message: `Переданы некорректные данные` });
      res.status(500).send({ message: `Внутренняя ошибка сервера` });
    })
};

const postUsers = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(() => {
      res.status(400).send({ message: `Переданы некорректные данные при создании пользователя.` });
      res.status(500).send({ message: `Внутренняя ошибка сервера` });
    });
};

const updateUserProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => {
      if (!user) { return res.status(404).send({ message: 'Пользователь не найден' }); }
      res.status(200).send(user);
    })
    .catch(() => {
      res.status(400).send({ message: `Переданы некорректные данные при создании пользователя.` });
      res.status(500).send({ message: `Внутренняя ошибка сервера` });
    });
};


const patchMeAvatar = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, avatar }, { new: true })
    .then((user) => {
      if (!user) { return res.status(404).send({ message: 'Пользователь с указанным id не найден.' }); }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') { return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' }); }
      return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  postUsers,
  updateUserProfile,
  patchMeAvatar,
};