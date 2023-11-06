const { ERROR_DEL_CARD } = require('../constants');

class DelCardErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_DEL_CARD;
  }
}

module.exports = DelCardErr;
