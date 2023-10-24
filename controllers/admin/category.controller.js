const _response = require("../../utils/response");
const status = require("../../constants/status");
const db = require("../../models");

module.exports.addCategory = async (req, res) => {
    const name = req.body?.name;
    const categoryInDB = await db.Category.count({ where: { name } });

    if (!categoryInDB) {
        const category = {
            name,
        };

        const newCategory = await db.Category.create(category);

        const responseData = {
            message: "Tạo danh mục thành công",
            data: newCategory,
        };

        return _response.responseSuccess(res, responseData);
    } else {
        const errorResponse = new _response.ErrorHandler(status.STATUS.UNPROCESSABLE_ENTITY, {
            name: "Danh mục đã tồn tại",
        });
        return res.status(status.STATUS.UNPROCESSABLE_ENTITY).json(errorResponse);
    }
};

module.exports.updateCategory = async (req, res) => {
    const name = req.body.name;
    const id = req.params.category_id;

    const categoryInDB = await db.Category.findOne({
        where: { id },
    });

    if (categoryInDB) {
        await db.Category.update(
            { name },
            { where: { id } }
        );

        const responseData = {
            message: "Cập nhật danh mục thành công",
        };

        return _response.responseSuccess(res, responseData);
    } else {
        const errorResponse = new _response.ErrorHandler(status.STATUS.BAD_REQUEST, {
            name: "Không tìm thấy danh mục",
        });
        return res.status(status.STATUS.BAD_REQUEST).json(errorResponse);
    }
};

module.exports.deleteCategory = async (req, res) => {
    const id = req.params.id;

    const categoryInDB = await db.Category.destroy({
        where: {
            id,
        },
    });

    if (categoryInDB) {
        const responseData = {
            message: "Xóa thành công",
        };
        return _response.responseSuccess(res, responseData);
    } else {
        const errorResponse = new _response.ErrorHandler(status.STATUS.BAD_REQUEST, {
            name: "Không tìm thấy danh mục",
        });
        return res.status(status.STATUS.BAD_REQUEST).json(errorResponse);
    }
};

module.exports.getCategories = async (req, res) => {
    const categories = await db.Category.findAll();

    const responseData = {
        message: "Lấy danh mục thành công",
        data: categories,
    };

    return _response.responseSuccess(res, responseData);
};

module.exports.getCategoryDetail = async (req, res) => {
    const id = req.params.id;
    const category = await db.Category.findOne({
        where: { id },
    });

    if (category) {
        const responseData = {
            message: "Lấy danh mục thành công",
            data: {
                id: category.id,
                name: category.name,
            },
        };
        return _response.responseSuccess(res, responseData);
    } else {
        const errorResponse = new _response.ErrorHandler(status.STATUS.UNAUTHORIZED, {
            name: "Không tìm thấy danh mục",
        });
        return res.status(status.STATUS.UNAUTHORIZED).json(errorResponse);
    }
};
