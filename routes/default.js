const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const NotExistErr = require('../errors/NotExistErr');
const auth = require('../middlewares/auth');

router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);
router.use('*', auth, (req, res, next) => {
  next(new NotExistErr('Переданы некорректные данные'));
});

module.exports = router;
