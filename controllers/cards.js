const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      if (cards.length === 0) {
        res.status(404).send({ message: "Карточки не найдены." });
        return;
      }
      res.status(200).send(cards);
    })
    .catch(() => {
      res.status(400).send({ message: `Переданы некорректные данные` });
      res.status(500).send({ message: `Внутренняя ошибка сервера` });
    })
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch(() => {
      res.status(400).send({ message: `Переданы некорректные данные при создании карточки.` });
      res.status(500).send({ message: `Внутренняя ошибка сервера` });
    })
}

const deleteCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((cards) => {
      res.status(200).send({ data: cards });
    })
    .catch(() => {
      res.status(400).send({ message: `Переданы некорректные данные` });
      res.status(500).send({ message: `Внутренняя ошибка сервера` });
    })
}

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((cards) => res.send({ cards }))

    .catch(() => {
      res.status(400).send({ message: `Переданы некорректные данные для постановки/снятии лайка.` });
      res.status(500).send({ message: `Внутренняя ошибка сервера` });
    })
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((cards) => res.send({ cards }))

    .catch(() => {
      res.status(400).send({ message: `Переданы некорректные данные для постановки/снятии лайка.` });
      res.status(500).send({ message: `Внутренняя ошибка сервера` });
    })
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
}
