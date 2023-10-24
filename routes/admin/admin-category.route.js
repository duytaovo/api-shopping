const express = require("express");
const categoryController = require("../../controllers/admin/category.controller");
const helpersMiddleware = require("../../middlewares/helpers.middleware");
const categoryMiddleware = require("../../middlewares/category.middleware");
const authMiddleware = require("../../middlewares/auth.middleware");

const adminCategoryRouter = express.Router();

adminCategoryRouter.get(
    "",
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyAdmin,
    categoryController.getCategories
);

adminCategoryRouter.get(
    "/:category_id",
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyAdmin,
    helpersMiddleware.idValidator,
    categoryController.getCategoryDetail
);

adminCategoryRouter.post(
    "",
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyAdmin,
    categoryMiddleware.addCategoryRules,
    helpersMiddleware.entityValidator,
    categoryController.addCategory
);

adminCategoryRouter.put(
    "/:category_id",
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyAdmin,
    helpersMiddleware.idValidator,
    categoryMiddleware.updateCategoryRules(),
    helpersMiddleware.entityValidator,
    categoryController.updateCategory
);

adminCategoryRouter.delete(
    "/delete/:category_id",
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyAdmin,
    helpersMiddleware.idValidator,
    categoryController.deleteCategory
);

module.exports = adminCategoryRouter;
