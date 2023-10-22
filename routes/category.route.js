const express = require("express");
const categoryController = require("../controllers/category.controller");
const categoryMiddleware = require("../middlewares/category.middleware");
const helpersMiddleware = require("../middlewares/helpers.middleware");
const { wrapAsync } = require("../utils/response");

const categoryRouter = express.Router();
/**
 * @openapi
 * '/':
 *  get:
 *     tags:
 *     - Category
 *     summary: Get Categories
 *     requestBody:
 *      required: false
 *     responses:
 *      200:
 *        description: Success
 */
categoryRouter.get(
  "/",
  // categoryMiddleware.getCategoryRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(categoryController.getCategories)
);
/**
 * @openapi
 * '/:category_id':
 *  get:
 *     tags:
 *     - Category
 *     summary: Get Category detail
 *     requestBody:
 *      required: false
 *     responses:
 *      200:
 *        description: Success
 */
categoryRouter.get(
  "/:category_id",
  helpersMiddleware.idValidator,
  wrapAsync(categoryController.getCategory)
);

module.exports = categoryRouter;
