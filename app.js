const express = require('express');
const mongoose = require('mongoose');
const BodyParser = require('body-parser');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const auth = require('./middlewares/auth');
const centralErrors = require('./middlewares/centralerrcontrol');
const { login, postUsers } = require('./controllers/users');
/* eslint-disable no-console */

const app = express();
const routes = require('./routes/routes');

const ava = /^https?:\/\/(www\.)?[a-zA-Z\d-]+\.[\w\d\-.~:/?#[\]@!$&'()*+,;=]{2,}#?$/;

const { PORT = 3000 } = process.env;

async function run() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mestodb');
  } catch (error) {
    console.log(error);
  }
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
}

app.use(auth);
app.use(BodyParser.json());
app.use(express.json());
app.use(errors());
app.use(routes);

const cardsRoutes = require('./routes/cards');
const usersRoutes = require('./routes/users');

app.use('/', cardsRoutes);
app.use('/', usersRoutes);
app.post('/signup', celebrate({
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

app.post('/signin', celebrate({
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

app.use(centralErrors);

run();
