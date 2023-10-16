const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { generateAcessToken } = require("../utils/generateAccessToken");

router.post("/refresh-token", (req, res) => {
  const { refreshToken } = req.body;
  jwt.verify(refreshToken, process.env.SECRET_KEY, (err, user) => {
    const accessToken = generateAcessToken({
      ...user,
      exp: Math.floor(new Date().getTime() / 1000) + 10 * 60,
    });
    res.json({ accessToken });
  });
});

module.exports.tokenRoute = router;
