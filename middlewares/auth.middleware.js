const config = require("../constants/config");
const jwt = require("../utils/jwt");
const role = require("../constants/role.enum");
const response = require("../utils/response");
const status = require("../constants/status");
const { body } = require("express-validator");

const db = require("../models");

module.exports.verifyAccessToken = async (req, res, next) => {
  const accessToken = req.headers.authorization?.replace("Bearer ", "");
  if (accessToken) {
    try {
      const decoded = await jwt.verifyToken(
        accessToken,
        config.config.SECRET_KEY
      );
      req.jwtDecoded = decoded;
      // const accessTokenDB = await db.AccessToken?.findOne({
      //   token: accessToken,
      // });
      if (decoded) {
        return next();
      }
      return response.responseError(
        res,
        new response.ErrorHandler(
          status.STATUS.UNAUTHORIZED,
          "Không tồn tại token"
        )
      );
    } catch (error) {
      return response.responseError(res, error);
    }
  }
  return response.responseError(
    res,
    new response.ErrorHandler(
      status.STATUS.UNAUTHORIZED,
      "Token không được gửi"
    )
  );
};

module.exports.verifyRefreshToken = async (req, res, next) => {
  const refreshToken = req.body.refreshToken;
  if (refreshToken) {
    try {
      const decoded = await jwt.verifyToken(
        refreshToken,
        config.config.SECRET_KEY
      );
      req.jwtDecoded = decoded;
      const refreshTokenDB = await db.RefreshToken.findOne({
        token: refreshToken,
      });
      if (refreshTokenDB) {
        return next();
      }
      return response.responseError(
        res,
        new response.ErrorHandler(
          status.STATUS.UNAUTHORIZED,
          "Không tồn tại token"
        )
      );
    } catch (error) {
      return response.responseError(res, error);
    }
  }
  return response.responseError(
    res,
    new response.ErrorHandler(
      status.STATUS.UNAUTHORIZED,
      "Token không được gửi"
    )
  );
};

module.exports.verifyAdmin = async (req, res, next) => {
  const userDB = await db.User.findByPk(req.jwtDecoded.id);
  if (userDB.roles.includes(role.ROLE.ADMIN)) {
    return next();
  }
  return response.responseError(
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
