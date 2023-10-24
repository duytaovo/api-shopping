const express = require("express");
const rootRouter = express.Router();

const userAdminRouter = require("./admin/admin-user.route");
const categoryAdminRouter = require("./admin/admin-category.route");
const productAdminRouter = require("./admin/admin-product.route");
const orderAdminRouter = require("./admin/admin-order.route");
const feedbackAdminRouter = require("./admin/admin-feedback.route");

const authRouter = require("./auth.route");
const productRouter = require("./product.route");
const categoryRouter = require("./category.route");
const userPurchaseRouter = require("./user/purchase.route");

// Admin
rootRouter.use("/admin/user", userAdminRouter);
rootRouter.use("/admin/category", categoryAdminRouter);
rootRouter.use("/admin/product", productAdminRouter);
rootRouter.use("/admin/order", orderAdminRouter);
rootRouter.use("/admin/feedback", feedbackAdminRouter);

rootRouter.use("/auth", authRouter);
rootRouter.use("/products", productRouter);
rootRouter.use("/categories", categoryRouter);
rootRouter.use("/purchases", userPurchaseRouter);

module.exports = {
  rootRouter,
};
