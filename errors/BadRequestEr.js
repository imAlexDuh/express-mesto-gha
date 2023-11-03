const { ERROR_BAD_REQUEST } = require('../middlewares/centralerrcontrol');

class BadRequestErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_BAD_REQUEST;
  }
}

module.exports = BadRequestErr;
