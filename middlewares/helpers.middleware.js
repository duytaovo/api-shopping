const expressValidator = require("express-validator");
const status = require("../constants/status");
const response = require("../utils/response");
// const validate = require("../utils/validate");
// module.exports.idRule = (...id) => {
//   return id.map((item) => {
//     return (0, expressValidator.check)(item)
//       .isMongoId()
//       .withMessage(`${item} không đúng định dạng`);
//   });
// };
// const listIdRule = (list_id) => {
//   return (0, expressValidator.body)(list_id)
//     .custom((value) =>
//       value.findIndex((item) => !(0, validate.isMongoId)(item))
//     )
//     .withMessage(`${list_id} không đúng định dạng`);
// };
module.exports.idValidator = (req, res, next) => {
  const errors = expressValidator.validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const error = errors.array().reduce((result, item, index) => {
    result[item.param] = item.msg;
    return result;
  }, {});
  return response.responseError(
    res,
    new response.ErrorHandler(status.STATUS.BAD_REQUEST, error)
  );
};
module.exports.entityValidator = (req, res, next) => {
  const errors = expressValidator.validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const error = errors
    .array({ onlyFirstError: true })
    .reduce((result, item, index) => {
      result[item.param] = item.msg;
      return result;
    }, {});
  return response.responseError(
    res,
    new response.ErrorHandler(status.STATUS.UNPROCESSABLE_ENTITY, error)
  );
};
