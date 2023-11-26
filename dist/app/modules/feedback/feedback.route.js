"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const feedback_controller_1 = require("./feedback.controller");
const feedback_validation_1 = require("./feedback.validation");
const router = express_1.default.Router();
// create feedback
router.post("/", (0, auth_1.default)(user_1.ENUM_USER_ROLE.HOUSE_RENTER, user_1.ENUM_USER_ROLE.HOUSE_OWNER), (0, validateRequest_1.default)(feedback_validation_1.FeedbackValidation.createFeedbackZodSchema), feedback_controller_1.FeedbackController.insertIntoDB);
// get all feedbacks
router.get("/", feedback_controller_1.FeedbackController.getAllFromDB);
// get single feedback
router.get("/:id", feedback_controller_1.FeedbackController.getByIdFromDB);
// update feedback
router.patch("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.HOUSE_OWNER, user_1.ENUM_USER_ROLE.HOUSE_RENTER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.default)(feedback_validation_1.FeedbackValidation.updateFeedbackZodSchema), feedback_controller_1.FeedbackController.updateOneInDB);
// delete feedback
router.delete("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.HOUSE_OWNER, user_1.ENUM_USER_ROLE.HOUSE_RENTER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), feedback_controller_1.FeedbackController.deleteByIdFromDB);
exports.FeedbackRoutes = router;
