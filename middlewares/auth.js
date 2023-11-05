const jwt = require('jsonwebtoken');

const { NODE_ENV, SECRET } = process.env;
const BadAuthErr = require('../errors/BadAuthErr');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new BadAuthErr('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? SECRET : 'dev-secret');
  } catch (err) {
    next(new BadAuthErr('Необходима авторизация'));
  }
  req.user = payload;

  return next();
};
