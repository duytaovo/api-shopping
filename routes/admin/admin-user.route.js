const express = require("express");
const userController = require("../../controllers/admin/user.controller");
const helpersMiddleware = require("../../middlewares/helpers.middleware");
const userMiddleware = require("../../middlewares/user.middleware");
const authMiddleware = require("../../middlewares/auth.middleware");
const { wrapAsync } = require("../../utils/response");

const adminUserRouter = express.Router();
adminUserRouter.get(
  "",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  userController.getUsers
);
adminUserRouter.post(
  "",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  userMiddleware.addUserRules,
  helpersMiddleware.entityValidator,
  userController.addUser
);
adminUserRouter.put(
  "/:user_id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.idValidator,
  userMiddleware.updateUserRules(),
  helpersMiddleware.entityValidator,
  userController.updateUser
);
adminUserRouter.get(
  "/:user_id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.idValidator,
  userController.deleteUser
);
adminUserRouter.delete(
  "/delete/:user_id",
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  helpersMiddleware.idValidator,
  userController.deleteUser
);

module.exports = adminUserRouter;
