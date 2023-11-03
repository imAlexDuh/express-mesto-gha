const { ERROR_BAD_AUTH } = require('../middlewares/centralerrcontrol');

class BadAuthError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_BAD_AUTH;
  }
}
module.exports = BadAuthError;
