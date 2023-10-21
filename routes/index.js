const express = require("express");
const rootRouter = express.Router();

const authRouter = require("./auth.route");
const userRouter = require("./admin/admin-user.route");

const { tokenRoute } = require("./token.route");

rootRouter.use("/auth", authRouter);
rootRouter.use("/token", tokenRoute);
rootRouter.use("/user", userRouter);

module.exports = {
  rootRouter,
};
