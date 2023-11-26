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
exports.BlogService = void 0;
const user_1 = require("../../../enums/user");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
const blog_constant_1 = require("./blog.constant");
// creat blog service
const insertIntoDB = (data, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, role } = user;
    if (role === user_1.ENUM_USER_ROLE.HOUSE_OWNER ||
        role === user_1.ENUM_USER_ROLE.HOUSE_RENTER) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Only house ADMIN and SUPER ADMIN can create blog.");
    }
    data["userId"] = id;
    const result = yield prisma_1.default.blog.create({
        data,
        include: {
            user: true,
        },
    });
    return result;
});
// get all blog service
const getAllFromDB = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelpers_1.paginationHelpers.calculatePagination(paginationOptions);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: blog_constant_1.blogFilterableFields.map((field) => ({
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
    const result = yield prisma_1.default.blog.findMany({
        include: {
            user: true,
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
    const total = yield prisma_1.default.blog.count({});
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
});
//get single blog service
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.blog.findUnique({
        where: {
            id,
        },
        include: {
            user: true,
        },
    });
    return result;
});
//   update blog service
const updateOneInDB = (id, data, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId, role } = user;
    const review = yield prisma_1.default.blog.findFirst({
        where: {
            id,
        },
        include: {
            user: true,
        },
    });
    if (userId !== (review === null || review === void 0 ? void 0 : review.userId) || role !== user_1.ENUM_USER_ROLE.SUPER_ADMIN) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Only Super Admin and blog crator can update blog.");
    }
    const result = yield prisma_1.default.blog.update({
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
//   delete blog service
const deleteByIdFromDB = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId, role } = user;
    const deletedBlog = yield prisma_1.default.blog.findFirst({
        where: {
            id,
        },
    });
    if ((deletedBlog === null || deletedBlog === void 0 ? void 0 : deletedBlog.userId) !== userId) {
        if (role !== user_1.ENUM_USER_ROLE.SUPER_ADMIN) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Only Super Admin and blog crator can delete blog.");
        }
    }
    const result = yield prisma_1.default.blog.delete({
        where: {
            id,
        },
        include: {
            user: true,
        },
    });
    return result;
});
exports.BlogService = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    updateOneInDB,
    deleteByIdFromDB,
};
