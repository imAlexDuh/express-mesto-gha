const Card = require('../models/card');

const DelErr = require('../errors/DelErr');
const NotExistErr = require('../errors/NotExistErr');
const BadRequestErr = require('../errors/BadRequestErr');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestErr('Переданы некорректные данные при создании карточки.'));
      }
      return next(err);
    });
};

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Сard.findByIdAndRemove(req.params.cardId)
    .then((cards) => {
      if (!cards) {
        throw new NotExistErr('Карточка с указанным _id не найдена.');
      } else if (!cards.owner.equals(req.user._id)) {
        throw new DelErr('Попытка удалить чужую карточку.');
      } else {
        return cards.remove().then(() => res.status(200).send(cards));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestErr('Переданы некорректные данные при удалении карточки.'));
      }
      return next(err);
    });
};

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
};
