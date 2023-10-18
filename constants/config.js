require("dotenv").config();

exports.config = {
  SECRET_KEY: process.env.SECRET_KEY_JWT || "",
  EXPIRE_ACCESS_TOKEN: 7 * 24 * 60 * 60,
  EXPIRE_REFRESH_TOKEN: 100 * 24 * 60 * 60,
};
// 60, "2 days", "10h", "7d". A numeric value is interpreted as a seconds count. If you use a string be sure you provide the time units (days, hours, etc), otherwise milliseconds unit is used by default ("120" is equal to "120ms").
exports.FOLDER_UPLOAD = "upload";
exports.FOLDERS = {
  PRODUCT: "product",
  AVATAR: "avatar",
};
exports.ROUTE_IMAGE = "images";
