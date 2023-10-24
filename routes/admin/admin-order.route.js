const express = require("express");
const orderController = require("../../controllers/admin/order.controller");
const helpersMiddleware = require("../../middlewares/helpers.middleware");
const orderMiddleware = require("../../middlewares/order.middleware");
const authMiddleware = require("../../middlewares/auth.middleware");

const adminOrderRouter = express.Router();

adminOrderRouter.get(
    "",
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyAdmin,
    orderController.getOrders
);

adminOrderRouter.get(
    "/:order_id",
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyAdmin,
    helpersMiddleware.idValidator,
    orderController.getOrderDetail
);

adminOrderRouter.put(
    "/:order_id",
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyAdmin,
    helpersMiddleware.idValidator,
    helpersMiddleware.entityValidator,
    orderController.confirmOrder
);

adminOrderRouter.put(
    "/:order_id",
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyAdmin,
    helpersMiddleware.idValidator,
    helpersMiddleware.entityValidator,
    orderController.cancelOrder
);

module.exports = adminOrderRouter;
