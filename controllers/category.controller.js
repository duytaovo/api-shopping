const _response = require("../utils/response");
const { STATUS } = require("../constants/status");
const db = require("../models");
const { Op } = require("sequelize");

module.exports.addCategory = async (req, res) => {
  const name = req.body.name;
  const categoryAdd = await db.Category.create({ name });

  const response = {
    message: "Tạo Category thành công",
    data: categoryAdd.toObject({
      transform: (doc, ret, option) => {
        delete ret.__v;
        return ret;
      },
    }),
  };

  return _response.responseSuccess(res, response);
};

module.exports.getCategories = async (req, res) => {
  const { exclude } = req.query;
  let condition = {};

  if (exclude) {
    condition = {
      id: {
        [Op.ne]: exclude,
      },
    };
  }

  try {
    const categories = await db.Category.findAll({
      where: condition,
      attributes: { exclude: ["__v"] },
    });

    const plainCategories = categories.map((category) =>
      category.get({ plain: true })
    );

    const response = {
      message: "Lấy categories thành công",
      data: plainCategories,
    };

    return _response.responseSuccess(res, response);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách categories" });
  }
};

module.exports.getCategory = async (req, res) => {
  const id = req.params.category_id;
  try {
    const category = await db.Category.findByPk(id, {});
    if (category !== null) {
      const categoryData = category.get({ plain: true });

      const response = {
        message: "Lấy category thành công",
        data: categoryData,
      };

      return _response.responseSuccess(res, response);
    } else {
      return res.json(
        new _response.ErrorHandler(
          STATUS.BAD_REQUEST,
          "Không tìm thấy Category"
        )
      );
    }
  } catch (error) {
    return res.status(500).json({ message: "Lỗi khi lấy thông tin Category" });
  }
};

module.exports.updateCategory = async (req, res) => {
  const { name } = req.body;

  try {
    const updatedCategory = await Category.update(
      { name },
      {
        where: {
          id: req.params.category_id,
        },
        returning: true,
      }
    );

    if (updatedCategory[0] > 0) {
      const updatedCategoryData = updatedCategory[1][0].get({ plain: true });

      const response = {
        message: "Cập nhật category thành công",
        data: updatedCategoryData,
      };

      return _response.responseSuccess(res, response);
    } else {
      throw new response.ErrorHandler(
        STATUS.BAD_REQUEST,
        "Không tìm thấy Category"
      );
    }
  } catch (error) {
    return res.status(500).json({ message: "Lỗi khi cập nhật Category" });
  }
};

module.exports.deleteCategory = async (req, res) => {
  const category_id = req.params.category_id;

  try {
    const deletedCategory = await Category.destroy({
      where: {
        id: category_id,
      },
    });

    if (deletedCategory > 0) {
      return res.json({ message: "Xóa thành công" });
    } else {
      throw new response.ErrorHandler(
        STATUS.BAD_REQUEST,
        "Không tìm thấy Category"
      );
    }
  } catch (error) {
    return res.status(500).json({ message: "Lỗi khi xóa Category" });
  }
};
