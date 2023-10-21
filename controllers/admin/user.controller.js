const crypt = require("../../utils/crypt");
const _response = require("../../utils/response");
const status = require("../../constants/status");
const lodash = require("lodash");
const config = require("../../constants/config");
const db = require("../../models");

module.exports.addUser = async (req, res) => {
  const form = req.body;
  const {
    email,
    password,
    address,
    date_of_birth,
    name,
    phone,
    roles,
    avatar,
  } = form;
  const userInDB = await db.User.count({ where: { email } });

  if (!userInDB) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const user = {
      email,
      password: hashedPassword,
      roles,
      address,
      date_of_birth,
      name,
      phone,
      avatar,
    };
    Object.keys(user).forEach(
      (key) => user[key] === undefined && delete user[key]
    );
    const userAdd = await db.User.create(user);
    const responseData = {
      message: "Tạo người dùng thành công",
      data: userAdd.toObject({
        transform: (doc, ret, option) => {
          delete ret.password;
          delete ret.__v;
          return ret;
        },
      }),
    };
    return _response.responseSuccess(res, responseData);
  }
  res.json(
    new _response.ErrorHandler(status.STATUS.UNPROCESSABLE_ENTITY, {
      email: "Email đã tồn tại",
    })
  );
};

module.exports.getUsers = async (req, res) => {
  const usersDB = await db.User.findAll();
  const responseData = {
    message: "Lấy người dùng thành công",
    data: usersDB,
  };
  return _response.responseSuccess(res, responseData);
};

module.exports.getDetailMySelf = async (req, res) => {
  const userDB = await db.Users?.findOne({
    where: { email: req.jwtDecoded.email },
  });
  if (userDB) {
    const response = {
      message: "Lấy người dùng thành công",
      user: {
        email: userDB.email,
        roles: userDB.roles,
        avatar: userDB.avatar,
      },
    };
    return _response.responseSuccess(res, response);
  } else {
    res.json(
      new _response.ErrorHandler(status.STATUS.UNAUTHORIZED, {
        password: "Không tìm thấy người dùng",
      })
    );
  }
};
module.exports.getUser = async (req, res) => {
  const usersDB = await db.user.findOne({
    where: { email: req.body.email },
  });
  const responseData = {
    message: "Lấy người dùng thành công",
    data: usersDB,
  };
  return _response.responseSuccess(res, responseData);
};

module.exports.updateUser = async (req, res) => {
  const form = req.body;
  const { password, address, date_of_birth, name, phone, roles, avatar } = form;
  const user = {
    password,
    address,
    date_of_birth,
    name,
    phone,
    roles,
    avatar,
    email,
  };

  const userDB = await db.Users?.findOne({
    where: { email: user.email },
  });

  await sequelize.query(
    `UPDATE Users SET phone = '${phone}' WHERE email = '${req.email}'`
  );

  if (userDB) {
    const responseData = {
      message: "Cập nhật người dùng thành công",
      data: userDB,
    };
    return _response.responseSuccess(res, responseData);
  } else {
    res.json(
      new _response.ErrorHandler(status.STATUS.BAD_REQUEST, {
        password: "Không tìm thấy người dùng",
      })
    );
  }
};
// const uploadAvatar = async (req, res) => {
//   const path = await (0, upload.uploadFile)(req, config.FOLDERS.AVATAR);
//   const response = {
//     message: "Upload ảnh đại diện thành công",
//     data: path,
//   };
//   return (0, _response.responseSuccess)(res, response);
// };
module.exports.updateMe = async (req, res) => {
  const form = req.body;
  const {
    email,
    password,
    new_password,
    address,
    date_of_birth,
    name,
    phone,
    avatar,
  } = form;
  const user = (0, lodash.omitBy)(
    {
      email,
      password,
      address,
      date_of_birth,
      name,
      phone,
      avatar,
    },
    (value) => value === undefined || value === ""
  );
  const userDB = await user_model_1.UserModel.findById(
    req.jwtDecoded.id
  ).lean();
  if (user.password) {
    const hash_password = (0, crypt.hashValue)(password);
    if (hash_password === userDB.password) {
      Object.assign(user, { password: (0, crypt.hashValue)(new_password) });
    } else {
      throw new _response.ErrorHandler(status.STATUS.UNPROCESSABLE_ENTITY, {
        password: "Password không đúng",
      });
    }
  }

  //   const updatedUserDB = await user_model_1.UserModel.findByIdAndUpdate(
  //     req.jwtDecoded.id,
  //     user,
  //     { new: true }
  //   )
  //     .select({ password: 0, __v: 0 })
  //     .lean();
  //   const response = {
  //     message: "Cập nhật thông tin thành công",
  //     data: updatedUserDB,
  //   };
  //   return (0, _response.responseSuccess)(res, response);
};
module.exports.deleteUser = async (req, res) => {
  const user_id = req.params.id;
  const userDB = await db.Users?.destroy({
    where: {
      id: user_id,
    },
  });

  if (userDB) {
    return _response.responseSuccess(res, { message: "Xóa thành công" });
  } else {
    res.json(
      new _response.ErrorHandler(status.STATUS.BAD_REQUEST, {
        password: "Không tìm thấy người dùng",
      })
    );
  }
};
