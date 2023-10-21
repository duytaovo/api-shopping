const formidable = require("formidable");
const fs = require("fs");
const shelljs = require("shelljs");
const mv = require("mv");
const _response = require("./response");
const status = require("../constants/status");
const lodash = require("lodash");
const uuid = require("uuid");
const config = require("../constants/config");

// lấy phần mở rộng của ảnh như jpg, jpeg
const getExtension = (filename) => /(?:\.([^.]+))?$/.exec(filename)[1];
const upload = (image, folder) => {
  return new Promise((resolve, reject) => {
    const dir = `${config.FOLDER_UPLOAD}${folder ? "/" + folder : ""}`;
    // Sử dụng fs.existsSync để kiểm tra xem thư mục có tồn tại hay không.
    // Sử dụng shelljs.mkdir('-p', dir) để tạo thư mục nếu nó không tồn tại.
    if (!fs.default.existsSync(dir)) {
      shelljs.default.mkdir("-p", dir);
    }
    // tmpPath: Đường dẫn tạm thời của tệp (đã tải lên).
    // newName: Tạo một tên mới cho tệp bằng cách sử dụng uuidv4() để tạo chuỗi duy nhất
    const tmpPath = image.filepath;
    const newName = (0, uuid.v4)() + "." + getExtension(image.originalFilename);
    const newPath = dir + "/" + newName;
    // Sử dụng mv để di chuyển tệp từ tmpPath (đã tải lên) sang newPath (đã đổi tên).
    mv(tmpPath, newPath, function (err) {
      if (err)
        return reject(
          new _response.ErrorHandler(
            status.STATUS.INTERNAL_SERVER_ERROR,
            "Lỗi đổi tên file"
          )
        );
      resolve(newName);
    });
  });
};
const uploadFile = (req, folder = "") => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (error, fields, files) => {
      if (error) {
        return reject(error);
      }
      try {
        const { image } = files; // Chú ý là image là mảng
        const errorEntity = {};
        console.log(image);
        if (!image || !image[0]) {
          errorEntity.image =
            "Không tìm thấy ảnh hoặc không đúng định dạng hình ảnh";
        }
        // else if (!image[0].type.includes('image')) {
        //   errorEntity.image = 'Ảnh không đúng định dạng'
        // }
        else if (image[0].size > 1000000) {
          errorEntity.image = "Kích thước ảnh phải <= 1MB";
        }
        if (!lodash.isEmpty(errorEntity)) {
          return reject(
            new _response.ErrorHandler(
              status.STATUS.UNPROCESSABLE_ENTITY,
              errorEntity
            )
          );
        }
        upload(image[0], folder) // Truyền image[0] thay vì image
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      } catch (err) {
        reject(err);
      }
    });
  });
};
exports.uploadFile = uploadFile;
const uploadManyFile = (req, folder = "") => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm({ multiples: true });
    form.parse(req, function (error, fields, files) {
      if (error) {
        return reject(error);
      }
      try {
        const { images } = files;
        const errorEntity = {};
        if (!images) {
          errorEntity.image = "Không tìm thấy images";
        }
        // else if (images.some((image) => !image.type.includes('image'))) {
        //   errorEntity.image = 'image không đúng định dạng'
        // }
        if (!lodash.isEmpty(errorEntity)) {
          return reject(
            new _response.ErrorHandler(
              status.STATUS.UNPROCESSABLE_ENTITY,
              errorEntity
            )
          );
        }
        const chainUpload = images.map((image) => {
          return upload(image, folder);
        });
        Promise.all(chainUpload)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      } catch (error) {
        reject(error);
      }
    });
  });
};
exports.uploadManyFile = uploadManyFile;
