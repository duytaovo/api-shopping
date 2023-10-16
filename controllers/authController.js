const jwt = require("jsonwebtoken");
const {
  authService,
  registerUserService,
  verifyAccount,
  logoutService,
} = require("../services/authService");
const { Exeptions } = require("../utils/ExeptionError");

const { query } = require("express-validator");

const { vi } = require("../utils/vi");
const { sequelize } = require("../models");
const { generateAcessToken } = require("../utils/generateAccessToken");
const {
  refreshTokenService,
  insertRefreshTokenService,
} = require("../services/refresh_token.service");

//This is login route
module.exports.authController = async (req, res, next) => {
  const { email, password } = req.body;
  authService(email, password).then(
    (admin) => {
      const user = {
        userId: admin.id,
        userUuid: admin.userUuid,
        permissions: admin.permissions,
      };
      const accessToken = generateAcessToken(user);
      const refreshToken = jwt.sign(user, process.env.SECRET_KEY);
      insertRefreshTokenService(user.userUuid, refreshToken).then(
        (token) => {
          return res.json({ accessToken, refreshToken: token });
        },
        (err) => {
          next(new Exeptions(err.message, err.status));
        }
      );
    },
    (err) => {
      const error = new Exeptions(err.message, err.status);
      next(error);
    }
  );
};

module.exports.checkLoggedOut = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
};

module.exports.getVerifyAccount = async (req, res, next) => {
  try {
    await verifyAccount(req.params.token).then(async (user) => {
      await sequelize.query(
        `UPDATE users SET isVerify = 1 WHERE id = ${user.userID}`
      );
      res.json(vi.transSuccess.account_actived);
      // res.redirect("/api/v1/auth/login");
    });
  } catch (error) {
    next(new Exeptions(error.message, error.status));
  }
};

module.exports.registerUserController = (req, res, next) => {
  const { email, password, confirmPass } = req.body;
  if (password !== confirmPass)
    return next(
      new Exeptions(
        "Mật khẩu và xác nhận mật khẩu không trùng khớp!",
        erorCode.password_not_match
      )
    );

  registerUserService(email, password, req.protocol, req.get("host")).then(
    (user) => {
      res.json(vi.transSuccess.userCreated(email));
    },
    (err) => {
      next(new Exeptions(err.message, err.status));
    }
  );
};
module.exports.LoggedOutUserController = (req, res, next, uuId) => {
  console.log(uuId);
  logoutService().then(
    (logout) => {
      return res.json(logout);
    },
    (err) => {
      return next(new Exeptions(err.message, err.status));
    }
  );
};
