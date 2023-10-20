const status = require("../constants/status");

const wrapAsync = (func) => {
  return function (req, res, next) {
    func(req, res, next).catch(next);
  };
};
exports.wrapAsync = wrapAsync;

class ErrorHandler extends Error {
  constructor(status, error) {
    super();
    this.status = status;
    this.error = error;
  }
}
exports.ErrorHandler = ErrorHandler;

const responseError = (res, error) => {
  if (error instanceof ErrorHandler) {
    const status = error.status;
    // Case just string
    if (typeof error.error === "string") {
      const message = error.error;
      return res.status(status).send({ message });
    }
    // Case error is object
    const errorObject = error.error;
    return res.status(status).send({
      message: "Lỗi",
      data: errorObject,
    });
  }
  return res
    .status(status.STATUS.INTERNAL_SERVER_ERROR)
    .send({ message: error.message });
};
exports.responseError = responseError;

module.exports.responseSuccess = (res, data) => {
  return res.status(status.STATUS.OK).send(data);
};
