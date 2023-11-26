"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const review_controller_1 = require("./review.controller");
const review_validation_1 = require("./review.validation");
const router = express_1.default.Router();
// create review
router.post("/", (0, auth_1.default)(user_1.ENUM_USER_ROLE.HOUSE_RENTER, user_1.ENUM_USER_ROLE.HOUSE_OWNER), (0, validateRequest_1.default)(review_validation_1.ReviewValidation.createReviewZodSchema), review_controller_1.ReviewController.insertIntoDB);
// get all reviews
router.get("/", review_controller_1.ReviewController.getAllFromDB);
// update review info
router.patch("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.HOUSE_OWNER, user_1.ENUM_USER_ROLE.HOUSE_RENTER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.default)(review_validation_1.ReviewValidation.updateReviewZodSchema), review_controller_1.ReviewController.updateOneInDB);
// delete reviews
router.delete("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.HOUSE_OWNER, user_1.ENUM_USER_ROLE.HOUSE_RENTER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), review_controller_1.ReviewController.deleteByIdFromDB);
exports.ReviewRoutes = router;
