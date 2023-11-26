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
exports.ReviewService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const user_1 = require("../../../enums/user");
// create review service
const insertIntoDB = (data, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = user;
    data["userId"] = id;
    const result = yield prisma_1.default.reviewAndRating.create({
        data,
        include: {
            user: true,
            house: true,
        },
    });
    return result;
});
// get all reviews
const getAllFromDB = (filterData, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelpers_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
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
    const result = yield prisma_1.default.reviewAndRating.findMany({
        include: {
            user: true,
            house: true,
        },
        where: whereConditions,
        skip,
        take: limit,
        orderBy: paginationOptions.sortBy && paginationOptions.sortOrder
            ? { [paginationOptions.sortBy]: paginationOptions.sortOrder }
            : {
                createdAt: "desc",
            },
    });
    const total = yield prisma_1.default.reviewAndRating.count({
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
// update review info service
const updateOneInDB = (id, data, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId } = user;
    const review = yield prisma_1.default.reviewAndRating.findFirst({
        where: {
            id,
        },
        include: {
            user: true,
            house: true,
        },
    });
    if (userId !== (review === null || review === void 0 ? void 0 : review.userId)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "You cann't update this comment because it is not your comment.");
    }
    const result = yield prisma_1.default.reviewAndRating.update({
        where: {
            id,
        },
        data,
        include: {
            user: true,
            house: true,
        },
    });
    return result;
});
// delete review
const deleteByIdFromDB = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId, role } = user;
    const review = yield prisma_1.default.reviewAndRating.findFirst({
        where: {
            id,
        },
    });
    if (role === user_1.ENUM_USER_ROLE.ADMIN ||
        role === user_1.ENUM_USER_ROLE.SUPER_ADMIN ||
        userId === (review === null || review === void 0 ? void 0 : review.userId)) {
        const result = yield prisma_1.default.reviewAndRating.delete({
            where: {
                id,
            },
        });
        return result;
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Only reviewer, admin and super admin can delete");
    }
});
exports.ReviewService = {
    insertIntoDB,
    getAllFromDB,
    updateOneInDB,
    deleteByIdFromDB,
};
