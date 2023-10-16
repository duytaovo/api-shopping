const db = require("../models");

module.exports.insertRefreshTokenService = (userUuid, refreshToken) => {
  return new Promise(async (resolve, reject) => {
    if (!refreshToken)
      return reject({ status: 400, message: "Invalid refresh token!" });
    const isExists = await db.refreshToken.count({ where: { userUuid } });
    if (isExists)
      return reject({
        // status: error_code.user_already_login,
        message: "You already login!",
      });
    const token = await db.refreshToken.create({ userUuid, refreshToken });
    resolve(token);
  });
};
