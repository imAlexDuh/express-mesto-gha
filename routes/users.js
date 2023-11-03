const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const {
  getUsers, getUserById, postUsers, updateUserProfile, patchMeAvatar, login, getCurrentUser,
} = require('../controllers/users');

usersRouter.get('/users', getUsers);
usersRouter.get('/users/:id', getUserById);
usersRouter.get('/signup', postUsers);

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
