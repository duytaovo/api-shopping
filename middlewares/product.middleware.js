const { body, query } = require("express-validator");

module.exports.getProductsRules = () => {
  return [
    query("page")
      .if((value) => value !== undefined)
      .isInt()
      .withMessage("page không đúng định dạng"),
    query("limit")
      .if((value) => value !== undefined)
      .isInt()
      .withMessage("limit không đúng định dạng"),
    // query("category")
    //   .if((value) => value !== undefined)
    //   .withMessage("category không đúng định dạng"),
    query("exclude").if((value) => value !== undefined),
    // .withMessage("exclude không đúng định dạng"),
  ];
};

module.exports.getAllProductsRules = () => {
  return [
    query("category")
      .if((value) => value !== undefined)
      .withMessage("category không đúng định dạng"),
  ];
};

module.exports.getPagesRules = () => {
  return [
    query("limit").isInt().withMessage("limit không đúng định dạng"),
    query("category")
      .if((value) => value !== undefined)
      .withMessage("category không đúng định dạng"),
  ];
};

module.exports.addProductRules = () => {
  return [
    body("name")
      .exists({ checkFalsy: true })
      .withMessage("Tiêu đề không được để trống")
      .isLength({ max: 160 })
      .withMessage("Tiêu đề  phải ít hơn 160 kí tự"),
    body("image")
      .exists({ checkFalsy: true })
      .withMessage("image không được để trống")
      .isLength({ max: 1000 })
      .withMessage("image  phải ít hơn 1000 kí tự"),
    body("images")
      .if((value) => value !== undefined)
      .isArray()
      .withMessage("images phải dạng string[]"),
    body("category")
      .exists({ checkFalsy: true })
      .withMessage("category không được để trống")
      .withMessage(`category phải là id`),
    body("price")
      .if((value) => value !== undefined)
      .isNumeric()
      .withMessage("price phải ở định dạng number"),
    body("price_before_discount")
      .if((value) => value !== undefined)
      .isNumeric()
      .withMessage("price_before_discount phải ở định dạng number"),
    body("quantity")
      .if((value) => value !== undefined)
      .isNumeric()
      .withMessage("quantity phải ở định dạng number"),
    body("view")
      .if((value) => value !== undefined)
      .isNumeric()
      .withMessage("view phải ở định dạng number"),
    body("sold")
      .if((value) => value !== undefined)
      .isNumeric()
      .withMessage("sold phải ở định dạng number"),
    body("rating")
      .if((value) => value !== undefined)
      .isNumeric()
      .withMessage("rating phải ở định dạng number"),
  ];
};

module.exports.updateProductRules = () => {
  return addProductRules();
};
