const express = require('express');
const mongoose = require('mongoose');
const BodyParser = require('body-parser');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const centralErrors = require('./middlewares/centralerrcontrol');
/* eslint-disable no-console */

const app = express();
const routes = require('./routes/routes');

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

// app.use(auth);
app.use(BodyParser.json());
app.use(express.json());
app.use(errors());
app.use(routes);
app.use(centralErrors);

const cardsRoutes = require('./routes/cards');
const usersRoutes = require('./routes/users');

app.use('/', cardsRoutes);
app.use('/', usersRoutes);
app.post('/signin', usersRoutes);
app.post('/signup', usersRoutes);

run();
