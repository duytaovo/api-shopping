const jsonwebtoken = require("jsonwebtoken");
const status = require("../constants/status");
const response = require("./response");

const signToken = (payload, secret_key, token_life) => {
  return new Promise((resolve, reject) => {
    jsonwebtoken.default.sign(
      payload,
      secret_key,
      { expiresIn: token_life },
      (error, token) => {
        if (error) {
          return reject(error);
        }
        resolve(token);
      }
    );
  });
};
exports.signToken = signToken;

const verifyToken = (token, secret_key) => {
  return new Promise((resolve, reject) => {
    jsonwebtoken.default.verify(token, secret_key, (error, decoded) => {
      if (error) {
        if (error.name === "TokenExpiredError") {
          reject(
            new response.ErrorHandler(status.STATUS.UNAUTHORIZED, {
              message: "Token hết hạn",
              name: "EXPIRED_TOKEN",
            })
          );
        } else {
          reject(
            new response.ErrorHandler(
              status.STATUS.UNAUTHORIZED,
              "Token không đúng"
            )
          );
        }
      }
      resolve(decoded);
    });
  });
};
exports.verifyToken = verifyToken;
