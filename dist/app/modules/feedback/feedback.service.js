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
exports.FeedbackService = void 0;
const user_1 = require("../../../enums/user");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
// creat feedback
const insertIntoDB = (data, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, role } = user;
    if (role === user_1.ENUM_USER_ROLE.ADMIN || role === user_1.ENUM_USER_ROLE.SUPER_ADMIN) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Only house renter and house owner can feedback.");
    }
    data["userId"] = id;
    const result = yield prisma_1.default.feedback.create({
        data,
        include: {
            user: true,
        },
    });
    return result;
});
// get all feedback
const getAllFromDB = (paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelpers_1.paginationHelpers.calculatePagination(paginationOptions);
    const result = yield prisma_1.default.feedback.findMany({
        include: {
            user: true,
        },
        skip,
        take: limit,
        orderBy: paginationOptions.sortBy && paginationOptions.sortOrder
            ? { [paginationOptions.sortBy]: paginationOptions.sortOrder }
            : {
                createdAt: "desc",
            },
    });
    const total = yield prisma_1.default.feedback.count({});
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
});
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.feedback.findUnique({
        where: {
            id,
        },
        include: {
            user: true,
        },
    });
    return result;
});
//   update feedback
const updateOneInDB = (id, data, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId } = user;
    const review = yield prisma_1.default.feedback.findFirst({
        where: {
            id,
        },
        include: {
            user: true,
        },
    });
    if (userId !== (review === null || review === void 0 ? void 0 : review.userId)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "You cann't update this comment because it is not your comment.");
    }
    const result = yield prisma_1.default.feedback.update({
        where: {
            id,
        },
        data,
        include: {
            user: true,
        },
    });
    return result;
});
//   delete feedback
const deleteByIdFromDB = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId, role } = user;
    const deletedFeedback = yield prisma_1.default.feedback.findFirst({
        where: {
            id,
        },
        include: {
            user: true,
        },
    });
    if (role === user_1.ENUM_USER_ROLE.ADMIN ||
        role ||
        user_1.ENUM_USER_ROLE.SUPER_ADMIN ||
        userId === (deletedFeedback === null || deletedFeedback === void 0 ? void 0 : deletedFeedback.userId)) {
        const result = yield prisma_1.default.feedback.delete({
            where: {
                id,
            },
            include: {
                user: true,
            },
        });
        return result;
    }
});
exports.FeedbackService = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    updateOneInDB,
    deleteByIdFromDB,
};
