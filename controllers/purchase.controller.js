const _purchase = require("../constants/purchase");
const _status = require("../constants/status");
const _response = require("../utils/response");
const db = require("../models");
const lodash = require("lodash");
const { Op } = require("sequelize");

module.exports.addToCart = async (req, res) => {
  const { product_id, buy_count } = req.body;
  console.log(buy_count);
  try {
    const product = await db.Product.findOne({ where: { id: product_id } });
    if (product) {
      if (buy_count > product.quantity) {
        console.log(buy_count);
        // Throw an error if buy_count exceeds product quantity
        res.json(
          new _response.ErrorHandler(
            _status.STATUS.NOT_ACCEPTABLE,
            "Số lượng vượt quá số lượng sản phẩm"
          )
        );
      }

      const purchaseInDb = await db.Order.findOne({
        where: {
          user: req.jwtDecoded.id,
          status: _purchase.STATUS_PURCHASE.IN_CART,
          product: product_id,
        },
      });
      console.log(purchaseInDb);

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
        data = await db.Order.findByPk(addedPurchase.id);
      }

      const response = {
        message: "Thêm sản phẩm vào giỏ hàng thành công",
        data,
      };

      return _response.responseSuccess(res, response);
    } else {
      res.json(
        _response.ErrorHandler(
          _status.STATUS.NOT_FOUND,
          "Không tìm thấy sản phẩm"
        )
      );
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
      res.json(
        new _response.ErrorHandler(
          _status.STATUS.NOT_FOUND,
          "Không tìm thấy đơn"
        )
      );
    }

    if (buy_count > purchaseInDb.product.quantity) {
      res.json(
        new _response.ErrorHandler(
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
      res.json(
        new _response.ErrorHandler(STATUS.NOT_FOUND, "Không tìm thấy đơn")
      );
    }
  } catch (error) {
    return res.status(500).json({ message: "Lỗi khi cập nhật đơn mua" });
  }
};

module.exports.buyProducts = async (req, res) => {
  const purchases = [];
  if (Array.isArray(req.body)) {
    const items = req.body;
    for (const item of items) {
      try {
        // Tìm thông tin sản phẩm dựa trên product_id
        const product = await db.Product.findByPk(item.product_id);
        if (!product) {
          res.json(
            new _response.ErrorHandler(
              _status.STATUS.NOT_FOUND,
              "Không tìm thấy sản phẩm"
            )
          );
        }

        if (item.buy_count > product.quantity) {
          res.json(
            new _response.ErrorHandler(
              _status.STATUS.NOT_ACCEPTABLE,
              "Số lượng mua vượt quá số lượng sản phẩm"
            )
          );
        } else {
          // Tìm đơn mua trong giỏ hàng của người dùng
          const purchaseInDb = await db.Order.findOne({
            where: {
              user: req.jwtDecoded.id,
              status: _purchase.STATUS_PURCHASE.IN_CART,
              product_id: item.product_id,
            },
            include: ["Product", "Category"],
          });

          if (purchaseInDb) {
            // Cập nhật thông tin đơn mua
            const updatedPurchase = await db.Order.update(
              {
                buy_count: item.buy_count,
                status: _purchase.STATUS_PURCHASE.WAIT_FOR_CONFIRMATION,
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
              status: _purchase.STATUS_PURCHASE.WAIT_FOR_CONFIRMATION,
            };

            const addedPurchase = await db.Order.create(newPurchase);

            const addedPurchaseData = await db.Order.findByPk(
              addedPurchase.id,
              {
                include: ["Product", "Category"],
              }
            );

            purchases.push(addedPurchaseData.get({ plain: true }));
          }
        }
      } catch (error) {
        return res.status(500).json({ message: "Lỗi khi mua sản phẩm" });
      }
    }
  }

  const response = {
    message: "Mua thành công",
    data: purchases,
  };

  return _response.responseSuccess(res, response);
};

module.exports.getPurchases = async (req, res) => {
  const { status = _purchase.STATUS_PURCHASE.ALL } = req.query;
  const user_id = req.jwtDecoded.id;
  let condition = {
    user: user_id,
    status: {
      [Op.ne]: _purchase.STATUS_PURCHASE.IN_CART,
    },
  };
  if (Number(status) !== _purchase.STATUS_PURCHASE.ALL) {
    condition.status = status;
  }

  try {
    const purchases = await db.Order.findAll({
      where: condition,
      include: ["Product", "Order"],
      order: [["createdAt", "DESC"]],
    });

    const purchasesData = purchases.map((purchase) => {
      purchase.product = handleImageProduct(lodash.cloneDeep(purchase.product));
      return purchase.get({ plain: true });
    });

    const response = {
      message: "Lấy đơn mua thành công",
      data: purchasesData,
    };

    return _response.responseSuccess(res, response);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi khi lấy đơn mua" });
  }
};

module.exports.deletePurchases = async (req, res) => {
  const purchase_ids = req.body;
  const user_id = req.jwtDecoded.id;

  try {
    const deletedData = await db.Order.destroy({
      where: {
        user: user_id,
        status: _purchase.STATUS_PURCHASE.IN_CART,
        id: { [Op.in]: purchase_ids },
      },
    });

    return res.json({
      message: `Xoá ${deletedData} đơn thành công`,
      data: { deleted_count: deletedData },
    });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi khi xóa đơn mua" });
  }
};
