const role_enum = require("../constants/role.enum");
const REGEX_EMAIL =
  /^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/;
const isEmail = (email) => {
  return REGEX_EMAIL.test(email);
};
exports.isEmail = isEmail;
const isAdmin = (req) => {
  var _a, _b;
  return (_b =
    (_a = req.jwtDecoded) === null || _a === void 0 ? void 0 : _a.roles) ===
    null || _b === void 0
    ? void 0
    : _b.includes(role_enum.ROLE.ADMIN);
};
exports.isAdmin = isAdmin;
