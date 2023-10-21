const express = require("express");
const authRouter = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const helpersMiddleware = require("../middlewares/helpers.middleware");
const authController = require("../controllers/auth.controller");
const { wrapAsync } = require("../utils/response");

/**
 * @openapi
 * '/register':
 *  post:
 *     tags:
 *     - Auth
 *     summary: Create a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *              name:
 *                password: string
 *     responses:
 *      201:
 *        description: Created
 */

authRouter.post(
  "/register",
  authMiddleware.registerRules(),
  helpersMiddleware.entityValidator,
  authController.registerController
);
/**
 * @openapi
 * '/login':
 *  post:
 *     tags:
 *     - Auth
 *     summary: Login a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *              name:
 *                password: string
 *     responses:
 *      201:
 *        description: Success
 */

authRouter.post(
  "/login",
  authMiddleware.loginRules(),
  helpersMiddleware.entityValidator,
  authController.loginController
);

/**
 * @openapi
 * '/logout':
 *  post:
 *     tags:
 *     - Auth
 *     summary: Logout a user
 *     requestBody:
 *      required: false
 *     responses:
 *      201:
 *        description: Success
 */
authRouter.post(
  "/logout",
  authMiddleware.verifyAccessToken,
  authController.logoutController
);

authRouter.post(
  "/refresh-access-token",
  authMiddleware.verifyRefreshToken,
  wrapAsync(authController.refreshTokenController)
);

module.exports = authRouter;
