const express = require("express");
const ProductController = require("../controllers/product.controller");
const helpersMiddleware = require("../middlewares/helpers.middleware");
const productMiddleware = require("../middlewares/product.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const { wrapAsync } = require("../utils/response");
const productRouter = express.Router();
/**
 * [Get products paginate]
 * @queryParam type: string, page: number, limit: number, category:mongoId, exclude: mongoId product
 * @route products
 * @method get
 */
productRouter.get(
  "",
  productMiddleware.getProductsRules(),
  helpersMiddleware.entityValidator,
  ProductController.getProducts
);

productRouter.get("/search", ProductController.searchProduct);

productRouter.get(
  "/:product_id",
  // helpersMiddleware.idRule("product_id"),
  helpersMiddleware.idValidator,
  ProductController.getProduct
);

module.exports = productRouter;