const { ERROR_BAD_AUTH } = require('../constants');

class BadAuthError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_BAD_AUTH;
  }
}
module.exports = BadAuthError;
