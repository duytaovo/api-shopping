const db = require("../models");

module.exports.insertRefreshTokenService = (email, refreshToken) => {
  return new Promise(async (resolve, reject) => {
    if (!refreshToken)
      return reject({ status: 400, message: "Invalid refresh token!" });
    const isExists = await db.RefreshToken.count({ where: { email } });
    if (isExists)
      return reject({
        status: 604,
        message: "You already login!",
      });
    const token = await db.refreshToken.create({ userUuid, refreshToken });
    resolve(token);
  });
};
