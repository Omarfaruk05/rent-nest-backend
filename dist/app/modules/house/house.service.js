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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HouseService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
const house_constant_1 = require("./house.constant");
const user_1 = require("../../../enums/user");
//create house
const insertIntoDB = (user, homeData) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = user;
    const isHouseOwner = yield prisma_1.default.user.findFirst({
        where: {
            id,
        },
    });
    if (!isHouseOwner || isHouseOwner.role != user_1.ENUM_USER_ROLE.HOUSE_OWNER) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "You are not authorized owner.");
    }
    function generateRandomPropertyId(length) {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }
        return result;
    }
    homeData.propertyId = generateRandomPropertyId(4);
    homeData.ownerId = id;
    homeData.availabilityDate = new Date(homeData === null || homeData === void 0 ? void 0 : homeData.availabilityDate);
    const result = yield prisma_1.default.house.create({
        data: homeData,
    });
    return result;
});
//get all houses
const getAllFromDB = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelpers_1.paginationHelpers.calculatePagination(paginationOptions);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: house_constant_1.HouseSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => {
                return {
                    [key]: {
                        equals: filterData[key],
                    },
                };
            }),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.house.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: paginationOptions.sortBy && paginationOptions.sortOrder
            ? { [paginationOptions.sortBy]: paginationOptions.sortOrder }
            : {
                createdAt: "desc",
            },
    });
    const total = yield prisma_1.default.house.count({
        where: whereConditions,
    });
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
});
// get single House service
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.house.findUnique({
        where: {
            id,
        },
        include: {
            owner: true,
        },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Sorry, There is no House with this id.");
    }
    return result;
});
// update House service
const updateOneInDB = (id, user, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId } = user;
    const house = yield prisma_1.default.house.findFirst({
        where: {
            id,
            ownerId: userId,
        },
    });
    if (!house) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Can't update the house because this is not your house.");
    }
    const result = yield prisma_1.default.house.update({
        where: {
            id,
        },
        data: updatedData,
    });
    return result;
});
// delete House service
const deleteByIdFromDB = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId, role } = user;
    if (role === user_1.ENUM_USER_ROLE.ADMIN || role === user_1.ENUM_USER_ROLE.SUPER_ADMIN) {
        const result = yield prisma_1.default.house.delete({
            where: {
                id,
            },
        });
        return result;
    }
    else {
        const house = yield prisma_1.default.house.findFirst({
            where: {
                id,
                ownerId: userId,
            },
        });
        if (!house) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Can't delete the house because this is not your house.");
        }
        const result = yield prisma_1.default.house.delete({
            where: {
                id,
            },
        });
        return result;
    }
});
exports.HouseService = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    updateOneInDB,
    deleteByIdFromDB,
};
