const express = require('express');
const mongoose = require('mongoose');
const BodyParser = require('body-parser');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();
const routes = require('./routes/routes');

app.use(auth);
app.use(BodyParser.json());
app.use(express.json());
app.use(errors());
app.use(routes);

const cardsRoutes = require('./routes/cards');
const usersRoutes = require('./routes/users');

const { PORT = 3000 } = process.env;

app.use('/', cardsRoutes);
app.use('/', usersRoutes);
app.post('/signin', usersRoutes);
app.post('/signup', usersRoutes);

/* eslint-disable no-console */
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
