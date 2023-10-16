const path = require("path");

const checkFileType = function (file, cb) {
  const fileTypes = /jpeg|jpg|png|gif|svg/;
  //check extension names
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);
  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb(new Error("Chỉ chấp nhận hình ảnh có đuôi jpeg, jpg, png, gif, svg"));
  }
};

module.exports.customeCheckFileType = checkFileType;
