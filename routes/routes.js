const express = require('express');
const userRouter = require('./users');
const cardRouter = require('./cards');

const app = express();

app.use(userRouter);
app.use(cardRouter);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Такой страницы не существует' });
});

module.exports = app;
