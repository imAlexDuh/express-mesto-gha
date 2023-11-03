const { ERROR_INTERNAL } = require('../constants');

module.exports = (err, req, res, next) => {
  const { statusCode = ERROR_INTERNAL, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === ERROR_INTERNAL
        ? 'Ошибка по умолчанию.'
        : message,
    });
  return next();
};
