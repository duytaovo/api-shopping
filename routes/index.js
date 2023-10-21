const express = require("express");
const rootRouter = express.Router();

const authRouter = require("./auth.route");
const userRouter = require("./admin/admin-user.route");

const { tokenRoute } = require("./token.route");
const productRouter = require("./product.route");

rootRouter.use("/auth", authRouter);
rootRouter.use("/token", tokenRoute);
rootRouter.use("/user", userRouter);
rootRouter.use("/products", productRouter);

module.exports = {
  rootRouter,
};
