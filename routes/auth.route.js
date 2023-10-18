const express = require("express");
const authRouter = express.Router();
const { authenticateToken } = require("../middlewares/authenticateToken");
const {
  authController,
  checkLoggedOut,
  registerUserController,
  getVerifyAccount,
  LoggedOutUserController,
} = require("../controllers/authController");
const {
  authService,
  registerUserService,
  verifyAccount,
  logoutService,
} = require("../services/authService");
const { authValid } = require("../validation/authValidation");
const authMiddleware = require("../middlewares/auth.middleware");
authRouter.post("/login", authController);

//sendMail
/**
 * @swagger
 * tags:
 *   name: auth
 *   description: Auth management
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: get a  verify account
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successful response
 */
authRouter.get("/verify/:token", getVerifyAccount);
/**
 * @swagger
 * tags:
 *   name: auth
 *   description: Auth management
 */

/**
 * @swagger
 * /:
 *   post:
 *     summary: post a  register account
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successful response
 */

authRouter.post(
  "/register",
  authMiddleware.registerRules(),
  helpers_middleware_1.default.entityValidator,
  (0, response_1.wrapAsync)(auth_controller_1.default.registerController)
);

module.exports = authRouter;
