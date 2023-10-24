const express = require("express");
const feedbackController = require("../../controllers/admin/feedback.controller");
const helpersMiddleware = require("../../middlewares/helpers.middleware");
const authMiddleware = require("../../middlewares/auth.middleware");

const adminFeedbackRouter = express.Router();

adminFeedbackRouter.get(
    "",
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyAdmin,
    feedbackController.getFeedbacks
);

adminFeedbackRouter.get(
    "/:feedback_id",
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyAdmin,
    helpersMiddleware.idValidator,
    feedbackController.getFeedbackDetail
);

adminFeedbackRouter.delete(
    "/delete/:feedback_id",
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyAdmin,
    helpersMiddleware.idValidator,
    feedbackController.deleteFeedback
);

module.exports = adminFeedbackRouter;
