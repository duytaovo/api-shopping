const _purchase = require("../constants/purchase");
const _status = require("../constants/status");
const _response = require("../utils/response");
const productController = require("./product.controller");
const db = require("../models");
const lodash = require("lodash");

module.exports.addToCart = async (req, res) => {
  const { product_id, buy_count } = req.body;

  try {
    const product = await db.Product.findByPk(product_id);

    if (product) {
      if (buy_count > product.quantity) {
        // Throw an error if buy_count exceeds product quantity
        throw new Error("Số lượng vượt quá số lượng sản phẩm");
      }

      const purchaseInDb = await db.Order.findOne({
        where: {
          user: req.jwtDecoded.id,
          status: _purchase.STATUS_PURCHASE.IN_CART,
          product: product_id,
        },
      });

      let data;

      if (purchaseInDb) {
        // Update existing purchase
        const updatedPurchase = await db.Order.update(
          { buy_count: purchaseInDb.buy_count + buy_count },
          { where: { id: purchaseInDb.id } }
        );

        data = await db.Order.findByPk(updatedPurchase.id);
      } else {
        // Create a new purchase
        const purchase = {
          user: req.jwtDecoded.id,
          product: product_id,
          buy_count: buy_count,
          price: product.price,
          price_before_discount: product.price_before_discount,
          status: _purchase.STATUS_PURCHASE.IN_CART,
        };
        const addedPurchase = await db.Order.create(purchase);
        data = await Purchase.findByPk(addedPurchase.id);
      }

      const response = {
        message: "Thêm sản phẩm vào giỏ hàng thành công",
        data,
      };

      return _response.responseSuccess(res, response);
    } else {
      return res.json(new Error("Không tìm thấy sản phẩm"));
    }
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports.updatePurchase = async (req, res) => {
  const { product_id, buy_count } = req.body;

  try {
    // Tìm đơn mua trong giỏ hàng của người dùng
    const purchaseInDb = await db.Order.findOne({
      where: {
        user: req.jwtDecoded.id,
        status: _purchase.STATUS_PURCHASE.IN_CART,
      },
      include: ["Product", "Order"],
    });

    if (!purchaseInDb) {
      res
        .status(500)
        .json(
          _response.ErrorHandler(_status.STATUS.NOT_FOUND, "Không tìm thấy đơn")
        );
    }

    if (buy_count > purchaseInDb.product.quantity) {
      res
        .status(500)
        .json(
          _response.ErrorHandler(
            _status.STATUS.NOT_ACCEPTABLE,
            "Số lượng vượt quá số lượng sản phẩm"
          )
        );
    }

    // Cập nhật đơn mua với số lượng mới
    const updatedPurchase = await db.Order.update(
      { buy_count },
      {
        where: {
          user: req.jwtDecoded.id,
          status: _purchase.STATUS_PURCHASE.IN_CART,
          id: purchaseInDb.id,
        },
        returning: true,
      }
    );

    if (updatedPurchase[0] > 0) {
      const updatedPurchaseData = updatedPurchase[1][0].get({ plain: true });

      const response = {
        message: "Cập nhật đơn thành công",
        data: updatedPurchaseData,
      };

      return _response.responseSuccess(res, response);
    } else {
      return res.json(
        new response.ErrorHandler(STATUS.NOT_FOUND, "Không tìm thấy đơn")
      );
    }
  } catch (error) {
    return res.status(500).json({ message: "Lỗi khi cập nhật đơn mua" });
  }
};

module.exports.buyProducts = async (req, res) => {
  const purchases = [];

  for (const item of req.body) {
    try {
      // Tìm thông tin sản phẩm dựa trên product_id
      const product = await db.Product.findOne({
        where: {
          id: item.product_id,
        },
      });

      if (!product) {
        return res.json(
          new _response.ErrorHandler(
            STATUS.NOT_FOUND,
            "Không tìm thấy sản phẩm"
          )
        );
      }

      if (item.buy_count > product.quantity) {
        return res.json(
          new _response.ErrorHandler(
            STATUS.NOT_ACCEPTABLE,
            "Số lượng mua vượt quá số lượng sản phẩm"
          )
        );
      } else {
        // Tìm đơn mua trong giỏ hàng của người dùng
        const purchaseInDb = await db.Order.findOne({
          where: {
            user: req.jwtDecoded.id,
            status: STATUS_PURCHASE.IN_CART,
            product_id: item.product_id,
          },
          include: {
            model: Product,
            include: {
              model: Category,
            },
          },
        });

        if (purchaseInDb) {
          // Cập nhật thông tin đơn mua
          const updatedPurchase = await Purchase.update(
            {
              buy_count: item.buy_count,
              status: STATUS_PURCHASE.WAIT_FOR_CONFIRMATION,
            },
            {
              where: {
                id: purchaseInDb.id,
              },
              returning: true,
            }
          );

          if (updatedPurchase[0] > 0) {
            const updatedPurchaseData = updatedPurchase[1][0].get({
              plain: true,
            });
            purchases.push(updatedPurchaseData);
          }
        } else {
          // Tạo mới đơn mua nếu không tồn tại
          const newPurchase = {
            user: req.jwtDecoded.id,
            product_id: item.product_id,
            buy_count: item.buy_count,
            price: product.price,
            price_before_discount: product.price_before_discount,
            status: STATUS_PURCHASE.WAIT_FOR_CONFIRMATION,
          };

          const addedPurchase = await Purchase.create(newPurchase);

          const addedPurchaseData = await Purchase.findByPk(addedPurchase.id, {
            include: {
              model: Product,
              include: {
                model: Category,
              },
            },
          });

          purchases.push(addedPurchaseData.get({ plain: true }));
        }
      }
    } catch (error) {
      return res.status(500).json({ message: "Lỗi khi mua sản phẩm" });
    }
  }

  const response = {
    message: "Mua thành công",
    data: purchases,
  };

  return res.json(response);
};
module.exports.getPurchases = async (req, res) => {
  const { status = purchase_1.STATUS_PURCHASE.ALL } = req.query;
  const user_id = req.jwtDecoded.id;
  let condition = {
    user: user_id,
    status: {
      $ne: purchase_1.STATUS_PURCHASE.IN_CART,
    },
  };
  if (Number(status) !== purchase_1.STATUS_PURCHASE.ALL) {
    condition.status = status;
  }
  let purchases = await purchase_model_1.PurchaseModel.find(condition)
    .populate({
      path: "product",
      populate: {
        path: "category",
      },
    })
    .sort({
      createdAt: -1,
    })
    .lean();
  purchases = purchases.map((purchase) => {
    purchase.product = (0, productController.handleImageProduct)(
      (0, lodash.cloneDeep)(purchase.product)
    );
    return purchase;
  });
  const response = {
    message: "Lấy đơn mua thành công",
    data: purchases,
  };
  return (0, response.responseSuccess)(res, response);
};
module.exports.deletePurchases = async (req, res) => {
  const purchase_ids = req.body;
  const user_id = req.jwtDecoded.id;
  const deletedData = await purchase_model_1.PurchaseModel.deleteMany({
    user: user_id,
    status: purchase_1.STATUS_PURCHASE.IN_CART,
    _id: { $in: purchase_ids },
  });
  return (0, response.responseSuccess)(res, {
    message: `Xoá ${deletedData.deletedCount} đơn thành công`,
    data: { deleted_count: deletedData.deletedCount },
  });
};
