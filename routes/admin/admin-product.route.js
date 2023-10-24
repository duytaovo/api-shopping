const express = require("express");
const productController = require("../../controllers/admin/product.controller");
const helpersMiddleware = require("../../middlewares/helpers.middleware");
const productMiddleware = require("../../middlewares/product.middleware");
const authMiddleware = require("../../middlewares/auth.middleware");

const adminProductRouter = express.Router();

adminProductRouter.get(
    "",
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyAdmin,
    productController.getProducts
);

adminProductRouter.get(
    "/:product_id",
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyAdmin,
    helpersMiddleware.idValidator,
    productController.getProductDetail
);

adminProductRouter.post(
    "",
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyAdmin,
    productMiddleware.addProductRules,
    helpersMiddleware.entityValidator,
    productController.addProduct
);

adminProductRouter.put(
    "/:product_id",
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyAdmin,
    helpersMiddleware.idValidator,
    helpersMiddleware.entityValidator,
    productController.updateProduct
);

adminProductRouter.delete(
    "/delete/:product_id",
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyAdmin,
    helpersMiddleware.idValidator,
    productController.deleteProduct
);

module.exports = adminProductRouter;
