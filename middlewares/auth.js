const jwt = require('jsonwebtoken');
const BadAuthErr = require('../errors/BadAuthErr');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new BadAuthErr('Необходима авторизация');
  }

  let payload;

  try {
    const { NODE_ENV, SECRET } = process.env;
    payload = jwt.verify(token, NODE_ENV === 'production' ? SECRET : 'dev-secret');
  } catch (err) {
    next(new BadAuthErr('Необходима авторизация'));
    return;
  }

  req.user = payload;
  next();
};