const URL_REGEX = /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/im;

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
  URL_REGEX,
};
