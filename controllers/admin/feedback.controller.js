const _response = require("../utils/response");
const status = require("../constants/status");
const db = require("../models");

module.exports.getFeedbacks = async (req, res) => {
    const feedbacks = await db.Feedback.query(
        "SELECT f.id, f.rating, f.comment, u.id as user_id, u.name as user_name, p.id as product_id, p.name as product_name "
        + " FROM Feedback AS f "
        + "   INNER JOIN Product AS p ON f.product_id = p.id "
        + "   INNER JOIN User AS u ON f.user_id = u.id "
        + " WHERE p.is_deleted = 0 "
    );

    const responseData = {
        message: "Lấy danh sách đánh giá",
        data: feedbacks,
    };

    return _response.responseSuccess(res, responseData);
};

module.exports.getFeedbackDetail = async (req, res) => {
    const id = req.params.id;
    const feedback = await db.Feedback.query(
        "SELECT f.id, f.rating, f.comment, u.id as user_id, u.name as user_name, p.id as product_id, p.name as product_name "
        + " FROM Feedback AS f "
        + "   INNER JOIN Product AS p ON f.product_id = p.id "
        + "   INNER JOIN User AS u ON f.user_id = u.id "
        + " WHERE p.is_deleted = 0 AND f.id = :id ",
        {
            replacements: { id: id},
            type: db.sequelize.QueryTypes.SELECT,
        }
    );
    if (feedback) {
        const response = {
            message: "Lấy đánh giá thành công",
            data: feedback
        };
        return _response.responseSuccess(res, response);
    } else {
        const errorResponse = new _response.ErrorHandler(status.STATUS.UNAUTHORIZED, {
            name: "Không tìm thấy đánh giá",
        });
        return res.status(status.STATUS.UNAUTHORIZED).json(errorResponse);
    }
};

module.exports.deleteFeedback = async (req, res) => {
    const id = req.params.id;

    const feedbackInDB = await db.Feedback.destroy({
        where: {
            id,
        },
    });

    if (feedbackInDB) {
        const responseData = {
            message: "Xóa đánh giá thành công",
        };
        return _response.responseSuccess(res, responseData);
    } else {
        const errorResponse = new _response.ErrorHandler(status.STATUS.BAD_REQUEST, {
            name: "Không tìm thấy đánh giá",
        });
        return res.status(status.STATUS.BAD_REQUEST).json(errorResponse);
    }
};