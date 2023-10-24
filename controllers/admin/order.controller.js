const _response = require("../../utils/response");
const status = require("../../constants/status");
const db = require("../../models");

module.exports.getOrders = async (req, res) => {
    const orders = await db.Order.query(
        "SELECT o.*, op.quantity, op.is_feedback, p.id AS product_id, p.name, p.brand, "
        + "   p.image_url, p.price, p.sale_price, p.description, p.display, p.os, p.main_camera, "
        + "   p.selfie_camera, p.chip, p.ram, p.rom, p.battery, p.priority, p.num, p.is_deleted " 
        + " FROM Order AS o "
        + "   INNER JOIN Order_Product AS op ON o.id = op.order_id "
        + "   INNER JOIN Product AS p ON op.product_id = p.id "
        + " WHERE p.is_deleted = 0 "
    );

    const responseData = {
        message: "Lấy danh sách đơn hàng thành công",
        data: orders,
    };

    return _response.responseSuccess(res, responseData);
};

module.exports.getOrderDetail = async (req, res) => {
    const id = req.params.id;
    const order = await db.Order.query(
        "SELECT o.*, op.quantity, op.is_feedback, p.id AS product_id, p.name, p.brand, "
        + "   p.image_url, p.price, p.sale_price, p.description, p.display, p.os, p.main_camera, "
        + "   p.selfie_camera, p.chip, p.ram, p.rom, p.battery, p.priority, p.num, p.is_deleted " 
        + " FROM Order AS o "
        + "   INNER JOIN Order_Product AS op ON o.id = op.order_id "
        + "   INNER JOIN Product AS p ON op.product_id = p.id "
        + " WHERE p.is_deleted = 0 AND o.id = :id ",
        {
            replacements: { id: id},
            type: db.sequelize.QueryTypes.SELECT,
        }
    );

    if (order) {
        const responseData = {
            message: "Lấy đơn hàng thành công",
            data: order
        };
        return _response.responseSuccess(res, responseData);
    } else {
        const errorResponse = new _response.ErrorHandler(status.STATUS.UNAUTHORIZED, {
            name: "Không tìm thấy danh mục",
        });
        return res.status(status.STATUS.UNAUTHORIZED).json(errorResponse);
    }
};

module.exports.confirmOrder  = async (req, res) => {
    const id = req.params.order_id;

    const order = await db.Order.query(
        "SELECT o.*, op.quantity, op.is_feedback, p.id AS product_id, p.name, p.brand, "
        + "   p.image_url, p.price, p.sale_price, p.description, p.display, p.os, p.main_camera, "
        + "   p.selfie_camera, p.chip, p.ram, p.rom, p.battery, p.priority, p.num, p.is_deleted " 
        + " FROM Order AS o "
        + "   INNER JOIN Order_Product AS op ON o.id = op.order_id "
        + "   INNER JOIN Product AS p ON op.product_id = p.id "
        + " WHERE p.is_deleted = 0 AND o.id = :id ",
        {
            replacements: { id: id},
            type: db.sequelize.QueryTypes.SELECT,
        }
    );

    if (order) {
        await db.Order.update(
            { status: 1 },
            { where: { id } }
        );

        const responseData = {
            message: "Xác nhận thành công đơn hàng",
        };

        return _response.responseSuccess(res, responseData);
    } else {
        const errorResponse = new _response.ErrorHandler(status.STATUS.BAD_REQUEST, {
            name: "Không tìm thấy đơn hàng",
        });
        return res.status(status.STATUS.BAD_REQUEST).json(errorResponse);
    }
};

module.exports.cancelOrder  = async (req, res) => {
    const id = req.params.order_id;

    const order = await db.Order.query(
        "SELECT o.*, op.quantity, op.is_feedback, p.id AS product_id, p.name, p.brand, "
        + "   p.image_url, p.price, p.sale_price, p.description, p.display, p.os, p.main_camera, "
        + "   p.selfie_camera, p.chip, p.ram, p.rom, p.battery, p.priority, p.num, p.is_deleted " 
        + " FROM Order AS o "
        + "   INNER JOIN Order_Product AS op ON o.id = op.order_id "
        + "   INNER JOIN Product AS p ON op.product_id = p.id "
        + " WHERE p.is_deleted = 0 AND o.id = :id ",
        {
            replacements: { id: id},
            type: db.sequelize.QueryTypes.SELECT,
        }
    );

    if (order) {
        await db.Order.update(
            { status: 2 },
            { where: { id } }
        );

        const responseData = {
            message: "Xác nhận hủy đơn hàng",
        };

        return _response.responseSuccess(res, responseData);
    } else {
        const errorResponse = new _response.ErrorHandler(status.STATUS.BAD_REQUEST, {
            name: "Không tìm thấy đơn hàng",
        });
        return res.status(status.STATUS.BAD_REQUEST).json(errorResponse);
    }
};
