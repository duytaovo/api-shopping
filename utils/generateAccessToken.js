const jwt = require("jsonwebtoken");
module.exports.generateAcessToken = (infos, expireAccessTokenConfig) =>
  jwt.sign(infos, process.env.SECRET_KEY, expireAccessTokenConfig);
