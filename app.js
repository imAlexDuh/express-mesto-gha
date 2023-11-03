const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const BodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
const auth = require('./middlewares/auth');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(BodyParser.json());
app.use(express.json());
app.use(BodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const cardsRoutes = require('./routes/cards');
const usersRoutes = require('./routes/users');
const { postUsers } = require('./controllers/users');

const { PORT = 3000 } = process.env;

app.use(auth);
app.use('/', cardsRoutes);
app.use('/', usersRoutes);
app.post('/signin', usersRoutes);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/),
  }),
}), postUsers);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Такой страницы не существует' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
