const config = require("../constants/config");
const jwt = require("../utils/jwt");
const role = require("../constants/role.enum");
const response = require("../utils/response");
const status = require("../constants/status");
// const access_token_model = require("../database/models/access-token.model");
// const refresh_token_model = require("../database/models/refresh-token.model");
const { body } = require("express-validator");

const db = require("../models");

module.exports.verifyAccessToken = async (req, res, next) => {
  var _a;
  const access_token =
    (_a = req.headers.authorization) === null || _a === void 0
      ? void 0
      : _a.replace("Bearer ", "");
  if (access_token) {
    try {
      const decoded = await (0, jwt.verifyToken)(
        access_token,
        config.config.SECRET_KEY
      );
      req.jwtDecoded = decoded;
      const accessTokenDB = await access_token_model.AccessTokenModel.findOne({
        token: access_token,
      }).exec();
      if (accessTokenDB) {
        return next();
      }
      return (0, response.responseError)(
        res,
        new response.ErrorHandler(
          status.STATUS.UNAUTHORIZED,
          "Không tồn tại token"
        )
      );
    } catch (error) {
      return (0, response.responseError)(res, error);
    }
  }
  return (0, response.responseError)(
    res,
    new response.ErrorHandler(
      status.STATUS.UNAUTHORIZED,
      "Token không được gửi"
    )
  );
};
module.exports.verifyRefreshToken = async (req, res, next) => {
  const refresh_token = req.body.refresh_token;
  if (refresh_token) {
    try {
      const decoded = await (0, jwt_1.verifyToken)(
        refresh_token,
        config.config.SECRET_KEY
      );
      req.jwtDecoded = decoded;
      const refreshTokenDB =
        await refresh_token_model.RefreshTokenModel.findOne({
          token: refresh_token,
        }).exec();
      if (refreshTokenDB) {
        return next();
      }
      return (0, response.responseError)(
        res,
        new response.ErrorHandler(
          status.STATUS.UNAUTHORIZED,
          "Không tồn tại token"
        )
      );
    } catch (error) {
      return (0, response.responseError)(res, error);
    }
  }
  return (0, response.responseError)(
    res,
    new response.ErrorHandler(
      status.STATUS.UNAUTHORIZED,
      "Token không được gửi"
    )
  );
};
module.exports.verifyAdmin = async (req, res, next) => {
  const userDB = await user_model.UserModel.findById(req.jwtDecoded.id).lean();
  if (userDB.roles.includes(role.ROLE.ADMIN)) {
    return next();
  }
  return (0, response.responseError)(
    res,
    new response.ErrorHandler(
      status.STATUS.FORBIDDEN,
      "Không có quyền truy cập"
    )
  );
};
module.exports.registerRules = () => {
  return [
    body("email")
      .isEmail()
      .withMessage("Email không đúng định dạng")
      .isLength({ min: 5, max: 160 })
      .withMessage("Email phải từ 5-160 kí tự"),
    body("password")
      .exists({ checkFalsy: true })
      .withMessage("Mật khẩu không được để trống")
      .isLength({ min: 6, max: 160 })
      .withMessage("Mật khẩu phải từ 6-160 kí tự"),
  ];
};
module.exports.loginRules = () => {
  return [
    body("email")
      .isEmail()
      .withMessage("Email không đúng định dạng")
      .isLength({ min: 5, max: 160 })
      .withMessage("Email phải từ 5-160 kí tự"),
    body("password")
      .isLength({ min: 6, max: 160 })
      .withMessage("Mật khẩu phải từ 6-160 kí tự"),
  ];
};
