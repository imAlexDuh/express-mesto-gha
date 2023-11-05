const express = require('express');
const router = require('./users');
const cardRouter = require('./cards');

const app = express();

app.use(router);
app.use(cardRouter);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Такой страницы не существует' });
});

module.exports = app;
