const _response = require("../utils/response");
const crypt = require("../utils/crypt");
const config = require("../constants/config");
const jwt = require("../utils/jwt");
const role_enum = require("../constants/role.enum");
const db = require("../models");
const lodash = require("lodash");
const status = require("../constants/status");
const bcrypt = require("bcryptjs");
const { generateAcessToken } = require("../utils/generateAccessToken");

const getExpire = (req) => {
  let expireAccessTokenConfig = Number(req.headers["expire-access-token"]);
  expireAccessTokenConfig = Number.isInteger(expireAccessTokenConfig)
    ? expireAccessTokenConfig
    : config.config.EXPIRE_ACCESS_TOKEN;
  let expireRefreshTokenConfig = Number(req.headers["expire-refresh-token"]);
  expireRefreshTokenConfig = Number.isInteger(expireRefreshTokenConfig)
    ? expireRefreshTokenConfig
    : config.config.EXPIRE_REFRESH_TOKEN;
  return {
    expireAccessTokenConfig,
    expireRefreshTokenConfig,
  };
};
module.exports.registerController = async (req, res) => {
  const { expireAccessTokenConfig, expireRefreshTokenConfig } = getExpire(req);
  const body = req.body;
  const { email, password } = body;

  const userInDB = await db.User.count({ where: { email } });

  if (!userInDB) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const userAdd = await db.User.create({ email, password: hashedPassword });

    const payloadJWT = {
      email,
      id: userAdd.id,
      roles: [role_enum.ROLE.USER],
      created_at: new Date().toISOString(),
    };
    const accessToken = await generateAcessToken(
      payloadJWT,
      config.config.SECRET_KEY,
      expireAccessTokenConfig
    );

    const refreshToken = await generateAcessToken(
      payloadJWT,
      config.config.SECRET_KEY,
      expireRefreshTokenConfig
    );
    await db.AccessToken.create({ id: userAdd.id, token: accessToken });
    await db.RefreshToken.create({ id: userAdd.id, token: refreshToken });

    const dataRes = {
      message: "Đăng ký thành công",
      data: {
        access_token: "Bearer " + accessToken,
        expires: config.config.EXPIRE_ACCESS_TOKEN,
        refresh_token: refreshToken,
        expires_refresh_token: expireRefreshTokenConfig,
        // user: (0, lodash.omit)(userAdd, ["password"]),
      },
    };
    return _response.responseSuccess(res, dataRes);
  }
  res.json(
    new _response.ErrorHandler(status.STATUS.UNPROCESSABLE_ENTITY, {
      email: "Email đã tồn tại",
    })
  );
};

module.exports.loginController = async (req, res) => {
  const { expireAccessTokenConfig, expireRefreshTokenConfig } = getExpire(req);
  const body = req.body;
  const { email, password } = body;
  const userInDB = await db.User.count({ where: { email } });
  if (!userInDB) {
    res.json(
      new _response.ErrorHandler(status.STATUS.UNPROCESSABLE_ENTITY, {
        password: "Email hoặc password không đúng",
      })
    );
  } else {
    const user = await db.User.findOne({ where: { email } });

    const match = bcrypt.compareSync(password, user.password);
    if (!match) {
      res.json(
        new _response.ErrorHandler(status.STATUS.UNPROCESSABLE_ENTITY, {
          password: "Email hoặc password không đúng",
        })
      );
    }
    let payloadJWT = {
      id: user.id,
      email: user.email,
      roles: user.roles,
      created_at: new Date().toISOString(),
    };
    const accessToken = await generateAcessToken(
      payloadJWT,
      config.config.SECRET_KEY,
      expireAccessTokenConfig
    );

    const refreshToken = await generateAcessToken(
      payloadJWT,
      config.config.SECRET_KEY,
      expireRefreshTokenConfig
    );
    await db.AccessToken.create({ token: accessToken });
    await db.RefreshToken.create({ token: refreshToken });

    const dataResponse = {
      message: "Đăng nhập thành công",
      data: {
        access_token: "Bearer " + accessToken,
        expires: expireAccessTokenConfig,
        refresh_token: refreshToken,
        expires_refresh_token: expireRefreshTokenConfig,
        // user: (0, lodash.omit)(userInDB, ["password"]),
      },
    };
    return _response.responseSuccess(res, dataResponse);
  }
};

module.exports.refreshTokenController = async (req, res) => {
  const { expireAccessTokenConfig } = getExpire(req);
  const userDB = await user_model_1.UserModel.findById(
    req.jwtDecoded.id
  ).lean();
  if (userDB) {
    const payload = {
      id: userDB._id,
      email: userDB.email,
      roles: userDB.roles,
      created_at: new Date().toISOString(),
    };
    const access_token = await (0, jwt.signToken)(
      payload,
      config.config.SECRET_KEY,
      expireAccessTokenConfig
    );
    await new access_token_model_1.AccessTokenModel({
      user_id: req.jwtDecoded.id,
      token: access_token,
    }).save();
    const response = {
      message: "Refresh Token thành công",
      data: { access_token: "Bearer " + access_token },
    };
    return (0, response.responseSuccess)(res, response);
  }
  throw new response.ErrorHandler(401, "Refresh Token không tồn tại");
};

module.exports.logoutController = async (req, res) => {
  const accessToken = req.headers.authorization?.replace("Bearer ", "");
  await db.AccessTokens?.destroy({
    where: {
      token: accessToken,
    },
  });

  return _response.responseSuccess(res, "Đăng xuất thành công");
};
