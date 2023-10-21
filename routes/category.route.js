const express = require("express");
const categoryController = require("../controllers/category.controller");
const categoryMiddleware = require("../middlewares/category.middleware");
const helpersMiddleware = require("../middlewares/helpers.middleware");
const { wrapAsync } = require("../utils/response");

const categoryRouter = express.Router();

categoryRouter.get(
  "/",
  // categoryMiddleware.getCategoryRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(categoryController.getCategories)
);

categoryRouter.get(
  "/:category_id",
  helpersMiddleware.idValidator,
  wrapAsync(categoryController.getCategory)
);
module.exports = categoryRouter;
