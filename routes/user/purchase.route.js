const express = require("express");
const authMiddleware = require("../../middlewares/auth.middleware");
const helperMiddleware = require("../../middlewares/helpers.middleware");
const purchaseMiddleware = require("../../middlewares/purchase.middleware");
const purchaseController = require("../../controllers/purchase.controller");
const { wrapAsync } = require("../../utils/response");

const userPurchaseRouter = express.Router();

userPurchaseRouter.post(
  "/buy-products",
  purchaseMiddleware.buyProductsRules(),
  helperMiddleware.entityValidator,
  authMiddleware.verifyAccessToken,
  wrapAsync(purchaseController.buyProducts)
);

userPurchaseRouter.post(
  "/add-to-cart",
  purchaseMiddleware.addToCartRules(),
  helperMiddleware.entityValidator,
  authMiddleware.verifyAccessToken,
  wrapAsync(purchaseController.addToCart)
);

userPurchaseRouter.put(
  "/update-purchase",
  purchaseMiddleware.updatePurchaseRules(),
  helperMiddleware.entityValidator,
  authMiddleware.verifyAccessToken,
  wrapAsync(purchaseController.updatePurchase)
);

userPurchaseRouter.delete(
  "",
  purchaseMiddleware.deletePurchasesRules(),
  helperMiddleware.entityValidator,
  authMiddleware.verifyAccessToken,
  wrapAsync(purchaseController.deletePurchases)
);

userPurchaseRouter.get(
  "",
  authMiddleware.verifyAccessToken,
  wrapAsync(purchaseController.getPurchases)
);

module.exports = userPurchaseRouter;
