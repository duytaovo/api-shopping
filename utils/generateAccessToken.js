const jwt = require("jsonwebtoken");
module.exports.generateAcessToken = (infos) =>
  jwt.sign(infos, process.env.SECRET_KEY);
