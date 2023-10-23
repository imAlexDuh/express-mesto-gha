const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') { return res.status(400).send({ message: 'Переданы некорректные данные.' }); }
      return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner:req.user._id })
    .then((card) => {
      res.status(201).send(card);
    })

    .catch((err) => {
      if (err.name === 'ValidationError') { return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' }); }
      return res.status(500).send({ message: 'Внутренняя ошибка сервера' });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
  .then((cards) => {
    if (!cards) { return res.status(404).send({ message: 'Такой карточки нет.' }); }
    return res.status(200).send(cards);
  })

  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные.' });
    }
    res.status(500).send({ message: 'Внутренняя ошибка сервера' });
  });
}

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
  .then((cards) => {
    if (!cards) { return res.status(404).send({ message: 'Такой карточки нет.' }); }
    return res.send({ cards });
  })

  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные.' });
    }
    res.status(500).send({ message: 'Внутренняя ошибка сервера' });
  });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
  .then((cards) => {
    if (!cards) { return res.status(404).send({ message: 'Такой карточки нет.' }); }
    return res.send({ cards });
  })

  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные.' });
    }
    res.status(500).send({ message: 'Внутренняя ошибка сервера' });
  });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
}
