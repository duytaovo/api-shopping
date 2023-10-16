class Exeptions extends Error {
  constructor(message, statusCode, status) {
    super(message);
    this.statusCode = statusCode || 500;
    this.status = status || "fail!";
  }
}

module.exports.Exeptions = Exeptions;
