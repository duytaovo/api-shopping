const crypto = require("crypto");

module.exports.hashValue = (value) => {
  return crypto.default.createHash("sha256").update(value).digest("hex");
};

module.exports.compareValue = (plainText, hash) => {
  return (0, exports.hashValue)(plainText) === hash;
};
