"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const booking_validation_1 = require("./booking.validation");
const booking_controller_1 = require("./booking.controller");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(user_1.ENUM_USER_ROLE.HOUSE_RENTER), (0, validateRequest_1.default)(booking_validation_1.BookingValidation.createBookingZodSchema), booking_controller_1.BookingController.insertIntoDB);
router.get("/", (0, auth_1.default)(user_1.ENUM_USER_ROLE.HOUSE_OWNER, user_1.ENUM_USER_ROLE.HOUSE_RENTER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), booking_controller_1.BookingController.getAllFromDB);
router.get("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.HOUSE_OWNER, user_1.ENUM_USER_ROLE.HOUSE_RENTER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), booking_controller_1.BookingController.getByIdFromDB);
router.patch("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.HOUSE_OWNER, user_1.ENUM_USER_ROLE.HOUSE_RENTER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), (0, validateRequest_1.default)(booking_validation_1.BookingValidation.updateBookingZodSchema), booking_controller_1.BookingController.updateOneInDB);
router.delete("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.HOUSE_OWNER, user_1.ENUM_USER_ROLE.HOUSE_RENTER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), booking_controller_1.BookingController.deleteByIdFromDB);
exports.BookingRoutes = router;
