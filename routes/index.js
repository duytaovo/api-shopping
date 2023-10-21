const express = require("express");
const rootRouter = express.Router();

const userAdminRouter = require("./admin/admin-user.route");

const authRouter = require("./auth.route");
const productRouter = require("./product.route");
const categoryRouter = require("./category.route");
const userPurchaseRouter = require("./user/purchase.route");

rootRouter.use("/auth", authRouter);
rootRouter.use("/user", userAdminRouter);
rootRouter.use("/products", productRouter);
rootRouter.use("/categories", categoryRouter);
rootRouter.use("/purchases", userPurchaseRouter);

module.exports = {
  rootRouter,
};
