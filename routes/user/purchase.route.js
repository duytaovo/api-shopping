const express = require("express");
const authMiddleware = require("../../middlewares/auth.middleware");
const helperMiddleware = require("../../middlewares/helpers.middleware");
const purchaseMiddleware = require("../../middlewares/purchase.middleware");
const purchaseController = require("../../controllers/purchase.controller");
const { wrapAsync } = require("../../utils/response");

const userPurchaseRouter = express.Router();
/**
 * @openapi
 * '/:category_id':
 *  post:
 *     tags:
 *     - Order
 *     summary: Post buy Product
 *     requestBody:
 *      required: true
 *     responses:
 *      200:
 *        description: Success
 */
userPurchaseRouter.post(
  "/buy-products",
  purchaseMiddleware.buyProductsRules(),
  helperMiddleware.entityValidator,
  authMiddleware.verifyAccessToken,
  wrapAsync(purchaseController.buyProducts)
);
/**
 * @openapi
 * '/add-to-cart':
 *  post:
 *     tags:
 *     - Order
 *     summary: add-to-cart
 *     requestBody:
 *      required: true
 *     responses:
 *      200:
 *        description: Success
 */

userPurchaseRouter.post(
  "/add-to-cart",
  // purchaseMiddleware.addToCartRules(),
  helperMiddleware.entityValidator,
  authMiddleware.verifyAccessToken,
  wrapAsync(purchaseController.addToCart)
);
/**
 * @openapi
 * '/update-purchase':
 *  put:
 *     tags:
 *     - Order
 *     summary: update-purchase
 *     requestBody:
 *      required: true
 *     responses:
 *      200:
 *        description: Success
 */
userPurchaseRouter.put(
  "/update-purchase",
  purchaseMiddleware.updatePurchaseRules(),
  helperMiddleware.entityValidator,
  authMiddleware.verifyAccessToken,
  wrapAsync(purchaseController.updatePurchase)
);

/**
 * @openapi
 * '/':
 *  delete:
 *     tags:
 *     - Order
 *     summary: delete-purchase
 *     requestBody:
 *      required: true
 *     responses:
 *      200:
 *        description: Success
 */

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
