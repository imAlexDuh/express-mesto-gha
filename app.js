const express = require('express');
const path = require('path');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

mongoose.connect("mongodb://127.0.0.1:27017/mestodb", {
  useNewUrlParser: true,
});

const cardsRoutes = require('./routes/cards');
const usersRoutes = require('./routes/users');

const app = express();

const { PORT = 3000 } = process.env;


app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '6532ce419cf7cfbec50c6791'
  };

  next();
});

app.use('/', cardsRoutes);

app.use('/', usersRoutes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

app.use('*', (req, res) => {
  res.status(404).send({ message: `Такой страницы не существует` });
});