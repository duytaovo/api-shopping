const express = require("express");
const authMiddleware = require("../../middlewares/auth.middleware");
const helperMiddleware = require("../../middlewares/helpers.middleware");
const purchaseMiddleware = require("../../middlewares/purchase.middleware");
const purchaseController = require("../../controllers/purchase.controller");
const response = require("../../utils/response");

exports.userPurchaseRouter = express.Router();

exports.userPurchaseRouter.post(
  "/buy-products",
  purchaseMiddleware.buyProductsRules(),
  helperMiddleware.default.entityValidator,
  authMiddleware.default.verifyAccessToken,
  response.wrapAsync(purchaseController.buyProducts)
);
exports.userPurchaseRouter.post(
  "/add-to-cart",
  purchaseMiddleware.addToCartRules(),
  helperMiddleware.default.entityValidator,
  authMiddleware.default.verifyAccessToken,
  response.wrapAsync(purchaseController.addToCart)
);
exports.userPurchaseRouter.put(
  "/update-purchase",
  purchaseMiddleware.updatePurchaseRules(),
  helperMiddleware.default.entityValidator,
  authMiddleware.default.verifyAccessToken,
  response.wrapAsync(purchaseController.updatePurchase)
);
exports.userPurchaseRouter.delete(
  "",
  purchaseMiddleware.deletePurchasesRules(),
  helperMiddleware.default.entityValidator,
  authMiddleware.default.verifyAccessToken,
  response.wrapAsync(purchaseController.deletePurchases)
);
exports.userPurchaseRouter.get(
  "",
  authMiddleware.default.verifyAccessToken,
  response.wrapAsync(purchaseController.getPurchases)
);
