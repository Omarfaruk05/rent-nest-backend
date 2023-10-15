"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HouseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const house_controller_1 = require("./house.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const house_validation_1 = require("./house.validation");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(user_1.ENUM_USER_ROLE.HOUSE_OWNER), (0, validateRequest_1.default)(house_validation_1.HouseValidation.createHouseZodSchema), house_controller_1.HouseController.insertIntoDB);
router.get("/", house_controller_1.HouseController.getAllFromDB);
router.get("/:id", house_controller_1.HouseController.getByIdFromDB);
router.patch("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.HOUSE_OWNER), (0, validateRequest_1.default)(house_validation_1.HouseValidation.updateHouseZodSchema), house_controller_1.HouseController.updateOneInDB);
router.delete("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.HOUSE_OWNER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.ADMIN), house_controller_1.HouseController.deleteByIdFromDB);
exports.HouseRoutes = router;
