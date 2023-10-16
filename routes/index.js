const express = require("express");
const rootRouter = express.Router();
const authRouter = require("./auth.route");

const { tokenRoute } = require("./token.route");

rootRouter.use("/auth", authRouter);
rootRouter.use("/token", tokenRoute);

module.exports = {
  rootRouter,
};
