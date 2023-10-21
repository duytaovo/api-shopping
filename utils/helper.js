require("dotenv").config();
exports.isProduction =
  process.env.NODE_ENV === "production" || process.argv[2] === "production";
exports.HOST = exports.isProduction
  ? process.env.PRODUCTION_HOST
  : `http://${process.env.HOST}:${process.env.PORT}`;
function removeAccents(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}
exports.removeAccents = removeAccents;
