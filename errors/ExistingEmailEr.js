const { ERROR_EXIST_EMAIL } = require('../constants');

class ExistingEmailEr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_EXIST_EMAIL;
  }
}

module.exports = ExistingEmailEr;