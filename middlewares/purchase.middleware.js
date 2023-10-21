const expressValidator = require("express-validator");
const validate = require("../utils/validate");
const buyProductsRules = () => {
  return [
    expressValidator
      .body()
      .isArray()
      .withMessage("body phải là array")
      .custom((value) => {
        if (value.length === 0) {
          return false;
        }
        const isPassed = value.every((item) => {
          if (
            validate.isMongoId(item.product_id) &&
            Number.isInteger(item.buy_count)
          ) {
            return true;
          }
          return false;
        });
        return isPassed;
      })
      .withMessage("body không đúng định dạng"),
  ];
};
exports.buyProductsRules = buyProductsRules;
const addToCartRules = () => {
  return [
    expressalidator
      .body("product_id")
      .exists({ checkFalsy: true })
      .withMessage("product_id không được để trống")
      .isMongoId()
      .withMessage("product_id không đúng định dạng"),
    expressalidator
      .body("buy_count")
      .exists({ checkFalsy: true })
      .withMessage("buy_count không được để trống")
      .custom((value) => {
        if (
          typeof value !== "number" ||
          value < 1 ||
          !Number.isInteger(value)
        ) {
          return false;
        }
        return true;
      })
      .withMessage("buy_count phải là số nguyên lớn hơn 0"),
  ];
};
exports.addToCartRules = addToCartRules;
exports.updatePurchaseRules = exports.addToCartRules;
const deletePurchasesRules = () => {
  return [
    expressalidator
      .body()
      .isArray()
      .withMessage("body phải là array")
      .custom((value) => {
        if (value.length === 0) {
          return false;
        }
        return value.every((id) => validate.isMongoId(id));
      })
      .withMessage("body phải là array id"),
  ];
};
exports.deletePurchasesRules = deletePurchasesRules;
