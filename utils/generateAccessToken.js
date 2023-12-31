const jwt = require("jsonwebtoken");

module.exports.generateAcessToken = (infos, expireAccessTokenConfig) =>
  jwt.sign(infos, process.env.SECRET_KEY, expireAccessTokenConfig);

module.exports.signToken = (payload, secret_key, token_life) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret_key, { expiresIn: token_life }, (error, token) => {
      if (error) {
        return reject(error);
      }
      resolve(token);
    });
  });
};

module.exports.authenticateToken = (req, res, next) => {
  const authHeaders = req.headers["authorization"];
  const token = authHeaders && authHeaders.split(" ")[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err)
      return res.sendStatus(403).json({ status: 403, message: err.message });
    req.user = user;

    next();
  });
};
