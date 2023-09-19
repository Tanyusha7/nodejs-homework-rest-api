const { httpErrorMess } = require("../constants");

class HttpError extends Error {
  constructor(
    status = 500,
    message = httpErrorMess[status] || httpErrorMess.default
  ) {
    super(message);
    this.status = status;
    this.name = "HttpError";
  }
}

module.exports = HttpError;
