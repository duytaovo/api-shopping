// const { body, param } = expressValidator;
const { body } = require("express-validator");
const { vi } = require("../utils/vi");

const registerValid = [
  body("email", vi.transValidation.email_incorrect).isEmail().trim(),
  body("password", vi.transValidation.password_incorrect)
    .isLength({ min: 6 })
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,}$/
    ),
  body(
    "password_confirmation",
    vi.transValidation.password_confirmation_incorrect
  ).custom((value, { req }) => {
    return value === req.body.password;
  }),
];
module.exports.authValid = { registerValid };
