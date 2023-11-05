const express = require('express');
const mongoose = require('mongoose');
const BodyParser = require('body-parser');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const router = require('./routes/default');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1/mestodb' } = process.env;

const app = express();
app.use(express.json());

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
mongoose.connect(DB_URL);
app.use(router);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode)
    .send({ message: statusCode === 500 ? 'На сервере произошла ошибка!' : message });
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Express is on port 3000');
});
