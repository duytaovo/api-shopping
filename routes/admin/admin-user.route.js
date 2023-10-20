const express = require("express");
const userController = require("../controllers/user.controller");

const helpers_middleware_1 = require("../../middleware/helpers.middleware");

const user_middleware_1 = require("../../middleware/user.middleware");

const auth_middleware_1 = require("../../middleware/auth.middleware");

const response_1 = require("../../utils/response");
const adminUserRouter = (0, express.Router)();
adminUserRouter.get(
  "",
  auth_middleware_1.default.verifyAccessToken,
  auth_middleware_1.default.verifyAdmin,
  userController.default.getUsers
);
adminUserRouter.post(
  "",
  auth_middleware_1.default.verifyAccessToken,
  auth_middleware_1.default.verifyAdmin,
  user_middleware_1.default.addUserRules(),
  helpers_middleware_1.default.entityValidator,
  (0, response_1.wrapAsync)(userController.default.addUser)
);
adminUserRouter.put(
  "/:user_id",
  auth_middleware_1.default.verifyAccessToken,
  auth_middleware_1.default.verifyAdmin,
  helpers_middleware_1.default.idRule("user_id"),
  helpers_middleware_1.default.idValidator,
  user_middleware_1.default.updateUserRules(),
  helpers_middleware_1.default.entityValidator,
  (0, response_1.wrapAsync)(userController.default.updateUser)
);
adminUserRouter.get(
  "/:user_id",
  auth_middleware_1.default.verifyAccessToken,
  auth_middleware_1.default.verifyAdmin,
  helpers_middleware_1.default.idRule("user_id"),
  helpers_middleware_1.default.idValidator,
  (0, response_1.wrapAsync)(userController.default.deleteUser)
);
adminUserRouter.delete(
  "/delete/:user_id",
  auth_middleware_1.default.verifyAccessToken,
  auth_middleware_1.default.verifyAdmin,
  helpers_middleware_1.default.idRule("user_id"),
  helpers_middleware_1.default.idValidator,
  (0, response_1.wrapAsync)(userController.default.deleteUser)
);
exports.default = adminUserRouter;
