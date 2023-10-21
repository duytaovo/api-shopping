const { body, query } = require("express-validator");

module.exports.addCategoryRules = () => {
  return [
    body("name")
      .exists({ checkFalsy: true })
      .withMessage("Tên không được để trống")
      .isLength({ max: 160 })
      .withMessage("Tên phải ít hơn 160 kí tự"),
  ];
};
module.exports.updateCategoryRules = () => {
  return addCategoryRules();
};

module.exports.getCategoryRules = () => {
  return [
    query("exclude")
      .if((value) => value)
      .withMessage("exclude không đúng định dạng"),
  ];
};
