const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const ava = /^https?:\/\/(www\.)?[a-zA-Z\d-]+\.[\w\d\-.~:/?#[\]@!$&'()*+,;=]{2,}#?$/;

const {
  getUsers, getUserById, postUsers, updateUserProfile, patchMeAvatar, login, getCurrentUser,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:id', getUserById);

router.post('/signup', celebrate({
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
      if (ava.test(value)) {
        return value;
      }
      return helpers.message('Некорректная ссылка');
    }),
  }),
}), postUsers);

router.post('/signin', celebrate({
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

router.patch('/users/me', updateUserProfile);
router.patch('/users/me/avatar', patchMeAvatar);
router.get('/users/me', getCurrentUser);

module.exports = router;
