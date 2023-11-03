const ERROR_BAD_REQUEST = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_INTERNAL = 500;
const ERROR_BAD_AUTH = 401;
const ERROR_DEL_CARD = 403;
const ERROR_EXIST_EMAIL = 409;

module.exports = {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL,
  ERROR_BAD_AUTH,
  ERROR_DEL_CARD,
  ERROR_EXIST_EMAIL,
};

module.exports = (err, req, res, next) => {
  const { statusCode = ERROR_INTERNAL, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === ERROR_INTERNAL
        ? `err.name = ${err.name} ; err.message = ${err.message} ; Ошибка по умолчанию.`
        : message,
    });
  return next();
};
