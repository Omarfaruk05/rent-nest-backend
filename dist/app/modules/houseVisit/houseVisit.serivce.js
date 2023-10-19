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
exports.HouseVisitService = exports.cenceleHouseVisit = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const houseVisit_constant_1 = require("./houseVisit.constant");
const user_1 = require("../../../enums/user");
const insertIntoDB = (data, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, role } = user;
    data["visitorId"] = id;
    data.visitDate = data.visitDate.toString().split("T")[0];
    const isExistVisitSlot = yield prisma_1.default.houseVisit.findMany({
        where: {
            houseId: data === null || data === void 0 ? void 0 : data.houseId,
            visitDate: data === null || data === void 0 ? void 0 : data.visitDate,
            visitSlot: data === null || data === void 0 ? void 0 : data.visitSlot,
        },
    });
    if (isExistVisitSlot.length) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Visiting slot is not available.");
    }
    if (role === user_1.ENUM_USER_ROLE.ADMIN || role === user_1.ENUM_USER_ROLE.SUPER_ADMIN) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Only house Renter and house owner can create visit House.");
    }
    if (role === user_1.ENUM_USER_ROLE.HOUSE_RENTER ||
        role === user_1.ENUM_USER_ROLE.HOUSE_OWNER) {
        const result = yield prisma_1.default.houseVisit.create({
            data,
        });
        return result;
    }
});
const getAllFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId, role } = user;
    if (role === user_1.ENUM_USER_ROLE.ADMIN || role === user_1.ENUM_USER_ROLE.SUPER_ADMIN) {
        const result = yield prisma_1.default.houseVisit.findMany({
            include: {
                house: true,
                visitor: true,
            },
        });
        return result;
    }
    else if (role === user_1.ENUM_USER_ROLE.HOUSE_OWNER) {
        const result = yield prisma_1.default.houseVisit.findMany({
            include: {
                house: true,
                visitor: true,
            },
            where: {
                house: {
                    ownerId: userId,
                },
            },
        });
        return result;
    }
    else if (role === user_1.ENUM_USER_ROLE.HOUSE_RENTER) {
        const result = yield prisma_1.default.houseVisit.findMany({
            include: {
                house: true,
                visitor: true,
            },
            where: {
                visitorId: userId,
            },
        });
        return result;
    }
});
const getAvailableSlods = (houseId, date) => __awaiter(void 0, void 0, void 0, function* () {
    date = date.split("T")[0];
    const bookedSlots = yield prisma_1.default.houseVisit.findMany({
        where: {
            houseId,
            visitDate: date,
        },
    });
    if (bookedSlots) {
        const bookedSlot = bookedSlots.map((bookedSlot) => {
            return bookedSlot.visitSlot;
        });
        const availableSlot = houseVisit_constant_1.bookingSlots.filter((slot) => !bookedSlot.includes(slot));
        return availableSlot;
    }
});
const cenceleHouseVisit = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId, role } = user;
    if (role === user_1.ENUM_USER_ROLE.HOUSE_RENTER) {
        const isHouseVisitExist = yield prisma_1.default.houseVisit.findMany({
            where: {
                visitorId: userId,
            },
        });
        if (!isHouseVisitExist.length) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "You have not House visit ");
        }
        if (isHouseVisitExist.some((house) => house.visitorId === userId)) {
            const result = yield prisma_1.default.houseVisit.delete({
                where: {
                    id,
                },
            });
            return result;
        }
    }
    if (role === user_1.ENUM_USER_ROLE.HOUSE_OWNER) {
        const isHouseVisitExist = yield prisma_1.default.houseVisit.findMany({
            where: {
                house: {
                    ownerId: userId,
                },
            },
            include: {
                house: {
                    include: {
                        owner: true,
                    },
                },
            },
        });
        if (!isHouseVisitExist.length) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "You have not House visit ");
        }
        if (isHouseVisitExist.some((house) => house.house.ownerId === userId)) {
            const result = yield prisma_1.default.houseVisit.delete({
                where: {
                    id,
                },
            });
            return result;
        }
    }
    if (role === user_1.ENUM_USER_ROLE.ADMIN || role === user_1.ENUM_USER_ROLE.SUPER_ADMIN) {
        const result = yield prisma_1.default.houseVisit.delete({
            where: {
                id,
            },
        });
        return result;
    }
});
exports.cenceleHouseVisit = cenceleHouseVisit;
exports.HouseVisitService = {
    insertIntoDB,
    getAllFromDB,
    getAvailableSlods,
    cenceleHouseVisit: exports.cenceleHouseVisit,
};
