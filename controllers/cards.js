/* eslint-disable consistent-return */
const Card = require('../models/card');

const BadRequestErr = require('../errors/BadRequestErr');
const NotExistErr = require('../errors/NotExistErr');
const DelCardErr = require('../errors/DelCardErr');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send(card);
    })

    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestErr('Переданы некорректные данные.'));
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
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) { throw new NotExistErr('Такой карточки нет.'); }
    })

    .then((card) => {
      if (req.user._id !== card.owner.toString()) {
        throw new DelCardErr('Нельзя удалять чужие карточки');
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then((removeCard) => res.status(200).send({ removeCard }))
        .catch(next);
    })

    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestErr('Переданы некорректные данные.'));
      }
      next(err);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((cards) => {
      if (!cards) { throw new NotExistErr('Такой карточки нет.'); }
      return res.send({ cards });
    })

    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestErr('Переданы некорректные данные.'));
      }
      return next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((cards) => {
      if (!cards) { throw new NotExistErr('Такой карточки нет.'); }
      return res.send({ cards });
    })

    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestErr('Переданы некорректные данные.'));
      }
      return next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
