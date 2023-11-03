const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const biba = /^https?:\/\/(www\.)?[a-zA-Z\d-]+\.[\w\d\-.~:/?#[\]@!$&'()*+,;=]{2,}#?$/;

const {
  getUsers, getUserById, postUsers, updateUserProfile, patchMeAvatar, login, getCurrentUser,
} = require('../controllers/users');

usersRouter.get('/users', getUsers);
usersRouter.get('/users/:id', getUserById);

usersRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Некорректный email');
    }),
    password: Joi.string().required(),
    avatar: Joi.string().custom((value, helpers) => {
      if (biba.test(value)) {
        return value;
      }
      return helpers.message('Некорректная ссылка');
    }),
  }),
}), postUsers);

usersRouter.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Некорректный email');
    }),
    password: Joi.string().required(),
  }),
}), login);

usersRouter.patch('/users/me', updateUserProfile);
usersRouter.patch('/users/me/avatar', patchMeAvatar);
usersRouter.get('/users/me', getCurrentUser);

module.exports = usersRouter;
