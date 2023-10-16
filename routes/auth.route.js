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
authRouter.post("/register", authValid.registerValid, registerUserController);
authRouter.post("/logout-user", authenticateToken, (req, res) => {
  logoutService(req.user.userUuid).then(
    (logout) => {
      return res.json(logout);
    },
    (err) => {
      return next(new Exeptions(err.message, err.status));
    }
  );

  // res.json(req.user);
});
module.exports = authRouter;
