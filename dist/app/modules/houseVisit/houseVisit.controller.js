"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HouseVisitController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const houseVisit_serivce_1 = require("./houseVisit.serivce");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
// create house visit slot
const insertIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield houseVisit_serivce_1.HouseVisitService.insertIntoDB(req.body, user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "House visit Created Successfully!",
        data: result,
    });
}));
// get all visiting slots
const getAllFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield houseVisit_serivce_1.HouseVisitService.getAllFromDB(user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "House visits fetched Successfully!",
        data: result,
    });
}));
// get available house visiting slot
const getAvalilableSlods = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, houseId } = req.query;
    const result = yield houseVisit_serivce_1.HouseVisitService.getAvailableSlods(houseId, date);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Get Available Slots Successfully!",
        data: result,
    });
}));
// delete house visit
const cenceleHouseVisit = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = req.user;
    const result = yield houseVisit_serivce_1.HouseVisitService.cenceleHouseVisit(id, user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Successfully canceled this house visit!",
        data: result,
    });
}));
exports.HouseVisitController = {
    insertIntoDB,
    getAllFromDB,
    getAvalilableSlods,
    cenceleHouseVisit,
};
