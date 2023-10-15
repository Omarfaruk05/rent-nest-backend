"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HouseVisitRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const houseVisit_controller_1 = require("./houseVisit.controller");
const houseVisit_validation_1 = require("./houseVisit.validation");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(user_1.ENUM_USER_ROLE.HOUSE_RENTER, user_1.ENUM_USER_ROLE.HOUSE_OWNER), (0, validateRequest_1.default)(houseVisit_validation_1.HouseVisitValidation.createHouseVisitodSchema), houseVisit_controller_1.HouseVisitController.insertIntoDB);
router.get("/", (0, auth_1.default)(user_1.ENUM_USER_ROLE.HOUSE_RENTER, user_1.ENUM_USER_ROLE.HOUSE_OWNER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), houseVisit_controller_1.HouseVisitController.getAllFromDB);
router.get("/slots", houseVisit_controller_1.HouseVisitController.getAvalilableSlods);
router.delete("/:id", houseVisit_controller_1.HouseVisitController.cenceleHouseVisit);
exports.HouseVisitRoutes = router;
