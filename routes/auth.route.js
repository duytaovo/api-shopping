const express = require("express");
const authRouter = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const helpersMiddleware = require("../middlewares/helpers.middleware");
const authController = require("../controllers/auth.controller");
const { authenticateToken } = require("../middlewares/authenticateToken");

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
  helpersMiddleware.entityValidator,
  authController.registerController
);

authRouter.post(
  "/login",
  authMiddleware.loginRules(),
  helpersMiddleware.entityValidator,
  authController.loginController
);

authRouter.post("/logout", authenticateToken, (req, res) => {
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
