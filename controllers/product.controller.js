const _response = require("../utils/response");
const db = require("../models");
const status = require("../constants/status");
const upload = require("../utils/upload");
const helper = require("../utils/helper");
const config = require("../constants/config");
const fs = require("fs");
const lodash = require("lodash");
const { Op } = require("sequelize");
const { ORDER, SORT_BY } = require("../constants/product");

const handleImageProduct = (product) => {
  if (product.image !== undefined && product.image !== "") {
    product.image = helper.HOST + `/${config.ROUTE_IMAGE}/` + product.image;
  }
  if (product.images !== undefined && product.images.length !== 0) {
    product.images = product.images.map((image) => {
      return image !== ""
        ? helper.HOST + `/${config.ROUTE_IMAGE}/` + image
        : "";
    });
  }
  return product;
};

module.exports.removeImageProduct = (image) => {
  if (image !== undefined && image !== "") {
    fs.unlink(
      `${config.FOLDER_UPLOAD}/${config.FOLDERS.PRODUCT}/${image}`,
      (err) => {
        if (err) console.error(err);
      }
    );
  }
};

module.exports.removeManyImageProduct = (images) => {
  if (images !== undefined && images.length > 0) {
    images.forEach((image) => {
      removeImageProduct(image);
    });
  }
};

module.exports.addProduct = async (req, res) => {
  const form = req.body;
  const {
    name,
    description,
    category,
    image,
    images,
    price,
    rating,
    price_before_discount,
    quantity,
    sold,
    view,
  } = form;

  const product = {
    name,
    description,
    category,
    image,
    images,
    price,
    rating,
    price_before_discount,
    quantity,
    sold,
    view,
  };
  try {
    const productAdd = await db.Product?.create(product);
    const responseData = {
      message: "Tạo sản phẩm thành công",
      data: productAdd.toObject({
        transform: (doc, ret, option) => {
          delete ret.__v;
          return handleImageProduct(ret);
        },
      }),
    };
    return _response.responseSuccess(res, responseData);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi khi truy vấn cơ sở dữ liệu" });
  }
};

module.exports.getProducts = async (req, res) => {
  let {
    page = 1,
    limit = 30,
    category,
    exclude,
    sort_by,
    order,
    rating_filter,
    price_max,
    price_min,
    name,
  } = req.query;
  page = Number(page);
  limit = Number(limit);

  let condition = {};
  if (category) {
    condition.category = category;
  }

  if (exclude) {
    condition.id = { [Op.ne]: exclude };
  }

  if (rating_filter) {
    condition.rating = { [Op.gte]: rating_filter };
  }

  if (price_max) {
    condition.price = {
      [Op.lte]: price_max,
    };
  }

  if (price_min) {
    if (condition.price) {
      condition.price[Op.gte] = price_min;
    } else {
      condition.price = { [Op.gte]: price_min };
    }
  }

  if (!ORDER.includes(order)) {
    order = ORDER[0];
  }
  if (!SORT_BY.includes(sort_by)) {
    sort_by = SORT_BY[0];
  }

  if (name) {
    condition.name = { [Op.iLike]: `%${name}%` };
  }

  // Sử dụng Sequelize để truy vấn cơ sở dữ liệu
  try {
    const products = await db.Product.findAll({
      where: condition,
      include: ["Category"],
      // order: [[sort_by, order]],
      offset: (page - 1) * limit,
      limit: limit,
      attributes: { exclude: ["description"] },
    });
    const totalProducts = await db.Product.count({ where: condition });
    const _products = products.map((product) => handleImageProduct(product));
    // Chuyển đổi kết quả thành dạng plain JavaScript objects
    const plainProducts = _products.map((product) =>
      product.get({ plain: true })
    );

    const page_size = Math.ceil(totalProducts / limit) || 1;

    const responseData = {
      message: "Lấy các sản phẩm thành công",
      data: {
        products: plainProducts,
        pagination: {
          page,
          limit,
          page_size: page_size,
        },
      },
    };
    return _response.responseSuccess(res, responseData);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi khi truy vấn cơ sở dữ liệu" });
  }
};
module.exports.getAllProducts = async (req, res) => {
  let { category } = req.query;
  let condition = {};

  if (category) {
    condition = { category: category };
  }

  // Sử dụng Sequelize để truy vấn cơ sở dữ liệu
  try {
    const products = await db.Product.findAll({
      where: condition,
      include: ["Category"],
      order: [["createdAt", "DESC"]],
      attributes: { exclude: ["description", "__v"] },
    });
    products = products.map((product) => handleImageProduct(product));

    // Chuyển đổi kết quả thành dạng plain JavaScript objects
    const plainProducts = products.map((product) =>
      product.get({ plain: true })
    );

    const response = {
      message: "Lấy tất cả sản phẩm thành công",
      data: plainProducts,
    };

    return _response.responseSuccess(res, response);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi khi truy vấn cơ sở dữ liệu" });
  }
};
module.exports.getProduct = async (req, res) => {
  let condition = { id: req.params.product_id };

  // Sử dụng Sequelize để truy vấn cơ sở dữ liệu
  try {
    const product = await db.Product.findOne({
      where: condition,
      include: ["Category"],
      attributes: { exclude: ["__v"] },
    });

    // Chuyển đổi kết quả thành dạng plain JavaScript object
    // const plainProduct = product.get({ plain: true });

    if (product) {
      const response = {
        message: "Lấy sản phẩm thành công",
        data: product,
      };
      return _response.responseSuccess(res, response);
    } else {
      res.json(
        new _response.ErrorHandler(
          status.STATUS.NOT_FOUND,
          "Không tìm thấy sản phẩm"
        )
      );
    }
  } catch (error) {
    return res.status(500).json({ message: "Lỗi khi truy vấn cơ sở dữ liệu" });
  }
};
module.exports.updateProduct = async (req, res) => {
  const form = req.body;
  const {
    name,
    description,
    category,
    image,
    rating,
    price,
    images,
    price_before_discount,
    quantity,
    sold,
    view,
  } = form;

  const product = lodash.omitBy(
    {
      name,
      description,
      category,
      image,
      rating,
      price,
      images,
      price_before_discount,
      quantity,
      sold,
      view,
    },
    (value) => value === undefined || value === ""
  );

  try {
    const [updatedRowsCount, updatedProduct] = await db.Product.update(
      product,
      {
        where: {
          id: req.params.product_id,
        },
        returning: true,
      }
    );

    if (updatedRowsCount > 0) {
      const response = {
        message: "Cập nhật sản phẩm thành công",
        data: updatedProduct[0].get({ plain: true }),
      };
      return _response.responseSuccess(res, response);
    } else {
      res.json(
        new _response.ErrorHandler(
          status.STATUS.NOT_FOUND,
          "Không tìm thấy sản phẩm"
        )
      );
    }
  } catch (error) {
    return res.status(500).json({ message: "Lỗi khi cập nhật sản phẩm" });
  }
};
module.exports.deleteProduct = async (req, res) => {
  const product_id = req.params.product_id;

  try {
    const product = await Product.findByPk(product_id);

    if (product) {
      // Lấy thông tin hình ảnh trước khi xóa
      removeImageProduct(productDB.image);
      removeManyImageProduct(productDB.images);

      // Xóa sản phẩm
      // await product.destroy();
      return _response.responseSuccess(res, { message: "Xóa thành công" });
    } else {
      res.json(
        new _response.ErrorHandler(
          status.STATUS.NOT_FOUND,
          "Không tìm thấy sản phẩm"
        )
      );
    }
  } catch (error) {
    return res.status(500).json({ message: "Lỗi khi xóa sản phẩm" });
  }
};
module.exports.deleteManyProducts = async (req, res) => {
  const list_id = req.body.list_id;

  // Sử dụng Sequelize để xóa nhiều sản phẩm
  try {
    const deletedData = await db.Product.destroy({
      where: {
        id: list_id,
      },
    });

    // Lấy danh sách sản phẩm đã xóa
    const productDB = await db.Product.findAll({
      where: {
        id: list_id,
      },
    });

    productDB.forEach((product) => {
      removeImageProduct(product.image);
      removeManyImageProduct(product.images);
    });

    if (productDB.length > 0) {
      return res.json({
        message: `Xóa ${deletedData} sản phẩm thành công`,
        data: { deleted_count: deletedData },
      });
    } else {
      throw new _response.ErrorHandler(
        status.STATUS.NOT_FOUND,
        "Không tìm thấy sản phẩm"
      );
    }
  } catch (error) {
    return res.status(500).json({ message: "Lỗi khi xóa sản phẩm" });
  }
};

module.exports.searchProduct = async (req, res) => {
  let { searchText } = req.query;
  searchText = decodeURI(searchText);

  // Sử dụng Sequelize để thực hiện tìm kiếm
  try {
    const products = await db.Product.findAll({
      where: {
        // Sử dụng một cơ chế tìm kiếm SQL thay vì $text
        name: {
          [Op.like]: `%${searchText}%`,
        },
      },
      include: ["Category"],
      order: [["createdAt", "DESC"]],
      attributes: { exclude: ["description", "__v"] },
    });
    let _products = products.map((product) => handleImageProduct(product));

    // Chuyển đổi kết quả thành dạng plain JavaScript objects
    const plainProducts = _products.map((product) =>
      product.get({ plain: true })
    );

    const response = {
      message: "Tìm các sản phẩm thành công",
      data: plainProducts,
    };

    return _response.responseSuccess(res, response);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi khi tìm kiếm sản phẩm" });
  }
};

module.exports.uploadProductImage = async (req, res) => {
  try {
    const path = await upload.uploadFile(req, config.FOLDERS.PRODUCT);
    const response = {
      message: "Upload ảnh thành công",
      data: path,
    };

    return _response.responseSuccess(res, response);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi khi upload ảnh sản phẩm" });
  }
};
module.exports.uploadManyProductImages = async (req, res) => {
  const paths = await upload.uploadManyFile(req, config.FOLDERS.PRODUCT);
  const response = {
    message: "Upload các ảnh thành công",
    data: paths,
  };
  return _response.responseSuccess(res, response);
};
