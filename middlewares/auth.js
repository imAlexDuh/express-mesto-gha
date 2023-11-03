const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(401).send({ message: 'Переданы некорректные данные.' });
  }

  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    res.status(401).send({ message: 'C токеном что-то не так.' });
  }

  req.user = payload;
  return next();
};
