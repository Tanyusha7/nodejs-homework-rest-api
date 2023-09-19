const httpErrorMess = {
  200: "Ok",
  201: "Created",
  204: "No Content",
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  408: "Request Timeout",
  409: "Conflict",
  422: "Unprocessable Content",
  500: "Internal Server Error",
  default: "Something went wrong, please try again later...",
};
module.exports = httpErrorMess;
