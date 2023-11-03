const jwt = require('jsonwebtoken');
const { SECRET } = require('../controllers/users');
const BadAuthError = require('../errors/BadAuthError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new BadAuthError('Необходима авторизация.');
  }

  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, SECRET);
  } catch (err) {
    throw new BadAuthError('Необходима авторизация.');
  }

  req.user = payload;
  return next();
};
