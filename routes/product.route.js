const express = require("express");
const ProductController = require("../controllers/product.controller");
const helpersMiddleware = require("../middlewares/helpers.middleware");
const productMiddleware = require("../middlewares/product.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const { wrapAsync } = require("../utils/response");
const commonProductRouter = express.Router();
/**
 * [Get products paginate]
 * @queryParam type: string, page: number, limit: number, category:mongoId, exclude: mongoId product
 * @route products
 * @method get
 */
commonProductRouter.get(
  "",
  productMiddleware.getProductsRules(),
  helpersMiddleware.entityValidator,
  ProductController.getProducts
);

commonProductRouter.get(
  "/:product_id",
  helpersMiddleware.idRule("product_id"),
  helpersMiddleware.idValidator,
  ProductController.getProduct
);

commonProductRouter.get("/search", ProductController.searchProduct);
export default commonProductRouter;
