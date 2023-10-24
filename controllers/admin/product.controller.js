const _response = require("../utils/response");
const status = require("../constants/status");
const db = require("../models");

module.exports.addProduct = async (req, res) => {
    const {
        name,
        brand,
        imageUrl,
        price,
        sale_price,
        description,
        display,
        os,
        main_camera,
        selfie_camera,
        chip,
        ram,
        rom,
        battery,
        priority,
        num,
    } = req.body;

    const product = {
        name,
        brand,
        imageUrl,
        price,
        sale_price,
        description,
        display,
        os,
        main_camera,
        selfie_camera,
        chip,
        ram,
        rom,
        battery,
        priority,
        num,
    }

    Object.keys(product).forEach(
        (key) => product[key] === undefined && delete product[key]
    );

    const newProduct = await db.Product.create(product);

    const responseData = {
        message: "Tạo sản phẩm thành công",
        data: newProduct,
    };

    return _response.responseSuccess(res, responseData);

};

module.exports.updateProduct = async (req, res) => {
    const {
        name,
        brand,
        imageUrl,
        price,
        sale_price,
        description,
        display,
        os,
        main_camera,
        selfie_camera,
        chip,
        ram,
        rom,
        battery,
        priority,
        num,
    } = req.body;
    const id = req.params.product_id;

    const productInDB = await db.Product.findOne({
        where: { id },
    });

    if (productInDB) {
        await db.Product.update(
            {
                name,
                brand,
                imageUrl,
                price,
                sale_price,
                description,
                display,
                os,
                main_camera,
                selfie_camera,
                chip,
                ram,
                rom,
                battery,
                priority,
                num,
            },
            { where: { id } }
        );

        const responseData = {
            message: "Cập nhật sản phẩm thành công",
        };

        return _response.responseSuccess(res, responseData);
    } else {
        const errorResponse = new _response.ErrorHandler(status.STATUS.BAD_REQUEST, {
            name: "Không tìm thấy sản phẩm",
        });
        return res.status(status.STATUS.BAD_REQUEST).json(errorResponse);
    }
};

module.exports.deleteProduct = async (req, res) => {
    const id = req.params.id;

    const productInDB = await db.Product.destroy({
        where: {
            id,
        },
    });

    if (productInDB) {
        const responseData = {
            message: "Xóa sản phẩm thành công",
        };
        return _response.responseSuccess(res, responseData);
    } else {
        const errorResponse = new _response.ErrorHandler(status.STATUS.BAD_REQUEST, {
            name: "Không tìm thấy sản phẩm",
        });
        return res.status(status.STATUS.BAD_REQUEST).json(errorResponse);
    }
};

module.exports.getProducts = async (req, res) => {
    const products = await db.Product.findAll({
        where: {is_deleted : 0}
    });

    const responseData = {
        message: "Lấy sản phẩm thành công",
        data: products,
    };

    return _response.responseSuccess(res, responseData);
};

module.exports.getProductDetail = async (req, res) => {
    const id = req.params.id;
    const product = await db.Product.findOne({
        where: { id: id, is_deleted: 0 },
    });
    if (product) {
        const response = {
            message: "Lấy sản phẩm thành công",
            data: {
                id: product.id,
                name: product.name,
                brand: product.brand,
                imageUrl: product.imageUrl,
                price: product.price,
                sale_price: product.sale_price,
                description: product.description,
                display: product.display,
                os: product.os,
                main_camera: product.main_camera,
                selfie_camera: product.selfie_camera,
                chip: product.chip,
                ram: product.ram,
                rom: product.rom,
                battery: product.battery,
                priority: product.priority,
                num: product.num,
            },
        };
        return _response.responseSuccess(res, response);
    } else {
        const errorResponse = new _response.ErrorHandler(status.STATUS.UNAUTHORIZED, {
            name: "Không tìm thấy sản phẩm",
        });
        return res.status(status.STATUS.UNAUTHORIZED).json(errorResponse);
    }
};
