const db = require("../models");
const bcrypt = require("bcryptjs");

module.exports.registerUserService = (
  email,
  password,
  fullname,
  phoneNumber
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const found = await db.user.count({ where: { email } });
      if (found)
        return reject({
          status: errorCode.email_has_been_used,
          message: "Email has been used!",
        });

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
      const user = await db.user.create({
        email,
        password: hashedPassword,
        fullname,
        phoneNumber: phoneNumber,
      });
      resolve(user);
    } catch (err) {
      reject({ message: err.message });
    }
  });
};

module.exports.getUserByEmailService = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const queries = { raw: true, rest: true };

      const response = await db.user.findOne({
        where: { email: body.email },
        include: ["cars"],
      });
      resolve(response);
    } catch (err) {
      reject({ message: err.message });
    }
  });
};
module.exports.updateIsDeletedUsersService = async (id, body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const IsDeletedUsers = await db.user.findOne({ where: { userUuid: id } });
      await IsDeletedUsers.update(body);

      resolve({
        message: "Success!",
        status: 200,
      });
    } catch (err) {
      reject({ status: errorCode.update_car_err, message: err.message });
    }
  });
};
