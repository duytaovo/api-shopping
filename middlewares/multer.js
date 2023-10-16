const multer = require("multer");
const { customeCheckFileType } = require("./checkFileType");
const fs = require("fs");
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const folder = req.path === "/upload-car-image" ? "cars" : "profiles";
    const path = `public/assets/images/${folder}/`;
    fs.mkdirSync(path, { recursive: true });
    callback(null, path);
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + `-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fieldSize: 2000000 },
  fileFilter: (req, file, cb) => {
    customeCheckFileType(file, cb);
  },
});

module.exports.upload = upload;
