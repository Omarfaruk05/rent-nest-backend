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
exports.UserService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const user_constant_1 = require("./user.constant");
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
const user_1 = require("../../../enums/user");
const createUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    data.password = yield bcrypt_1.default.hash(data.password, Number(config_1.default.bycrypt_salt_rounds));
    const isUserExist = yield prisma_1.default.user.findFirst({
        where: {
            email: data === null || data === void 0 ? void 0 : data.email,
        },
    });
    if (isUserExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "This is email is already used!");
    }
    if (data.role === user_1.ENUM_USER_ROLE.HOUSE_OWNER) {
        yield prisma_1.default.houseOwner.create({ data });
        return yield prisma_1.default.user.create({
            data,
        });
    }
    if (data.role === user_1.ENUM_USER_ROLE.HOUSE_RENTER) {
        yield prisma_1.default.houseRenter.create({
            data,
        });
        return yield prisma_1.default.user.create({ data });
    }
});
const createAdmin = (data) => __awaiter(void 0, void 0, void 0, function* () {
    data.password = yield bcrypt_1.default.hash(data.password, Number(config_1.default.bycrypt_salt_rounds));
    if (data.role !== user_1.ENUM_USER_ROLE.ADMIN) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User role must be admin");
    }
    yield yield prisma_1.default.admin.create({
        data,
    });
    const result = prisma_1.default.user.create({ data });
    return result;
});
const getAllFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelpers_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: user_constant_1.UserSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: filterData[key],
            })),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.user.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {},
    });
    const total = yield prisma_1.default.user.count({
        where: whereConditions,
    });
    const totalPage = Math.ceil(total / limit);
    return {
        meta: {
            total: totalPage,
            page,
            limit,
        },
        data: result,
    };
});
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findFirst({
        where: {
            id,
        },
    });
    return result;
});
const updatMyProfile = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.update({
        where: {
            id,
        },
        data,
    });
    return result;
});
const makeAdmin = (id, data, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: useId, role } = user;
    console.log(role);
    if (role === user_1.ENUM_USER_ROLE.HOUSE_OWNER ||
        role === user_1.ENUM_USER_ROLE.HOUSE_RENTER) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Only admin and super admin can make admin");
    }
    const result = yield prisma_1.default.user.update({
        where: {
            id,
        },
        data,
    });
    return result;
});
const deleteUserInDB = (id, userRole) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findFirst({
        where: {
            id,
        },
    });
    if ((isUserExist && isUserExist.role === user_1.ENUM_USER_ROLE.HOUSE_RENTER) ||
        (isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.role) === user_1.ENUM_USER_ROLE.HOUSE_OWNER ||
        (isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.role) === user_1.ENUM_USER_ROLE.ADMIN) {
        yield prisma_1.default.bookedHouse.deleteMany({
            where: {
                user: {
                    email: isUserExist.email,
                },
            },
        });
    }
    if ((isUserExist && isUserExist.role === user_1.ENUM_USER_ROLE.HOUSE_RENTER) ||
        (isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.role) === user_1.ENUM_USER_ROLE.HOUSE_OWNER ||
        (isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.role) === user_1.ENUM_USER_ROLE.ADMIN) {
        yield prisma_1.default.reviewAndRating.deleteMany({
            where: {
                user: {
                    email: isUserExist.email,
                },
            },
        });
    }
    if ((isUserExist && isUserExist.role === user_1.ENUM_USER_ROLE.HOUSE_RENTER) ||
        (isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.role) === user_1.ENUM_USER_ROLE.HOUSE_OWNER ||
        (isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.role) === user_1.ENUM_USER_ROLE.ADMIN) {
        yield prisma_1.default.houseVisit.deleteMany({
            where: {
                visitor: {
                    email: isUserExist.email,
                },
            },
        });
    }
    if ((isUserExist && isUserExist.role === user_1.ENUM_USER_ROLE.HOUSE_RENTER) ||
        (isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.role) === user_1.ENUM_USER_ROLE.HOUSE_OWNER ||
        (isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.role) === user_1.ENUM_USER_ROLE.ADMIN) {
        yield prisma_1.default.feedback.deleteMany({
            where: {
                user: {
                    email: isUserExist.email,
                },
            },
        });
    }
    if ((isUserExist && isUserExist.role === user_1.ENUM_USER_ROLE.HOUSE_RENTER) ||
        (isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.role) === user_1.ENUM_USER_ROLE.HOUSE_OWNER ||
        (isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.role) === user_1.ENUM_USER_ROLE.ADMIN) {
        yield prisma_1.default.addToCart.deleteMany({
            where: {
                user: {
                    email: isUserExist.email,
                },
            },
        });
    }
    if ((isUserExist && isUserExist.role === user_1.ENUM_USER_ROLE.HOUSE_RENTER) ||
        (isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.role) === user_1.ENUM_USER_ROLE.HOUSE_OWNER ||
        (isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.role) === user_1.ENUM_USER_ROLE.ADMIN) {
        yield prisma_1.default.house.deleteMany({
            where: {
                ownerId: isUserExist.id,
            },
        });
    }
    if ((isUserExist && isUserExist.role === user_1.ENUM_USER_ROLE.HOUSE_RENTER) ||
        (isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.role) === user_1.ENUM_USER_ROLE.HOUSE_OWNER ||
        (isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.role) === user_1.ENUM_USER_ROLE.ADMIN) {
        yield prisma_1.default.feedback.deleteMany({
            where: {
                userId: isUserExist.id,
            },
        });
    }
    if ((isUserExist && isUserExist.role === user_1.ENUM_USER_ROLE.HOUSE_RENTER) ||
        (isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.role) === user_1.ENUM_USER_ROLE.HOUSE_OWNER ||
        (isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.role) === user_1.ENUM_USER_ROLE.ADMIN) {
        yield prisma_1.default.reviewAndRating.deleteMany({
            where: {
                userId: isUserExist.id,
            },
        });
    }
    //super admin and admin
    if (isUserExist && userRole === user_1.ENUM_USER_ROLE.SUPER_ADMIN) {
        const result = yield prisma_1.default.user.delete({
            where: {
                id,
            },
        });
        return result;
    }
    if (userRole === user_1.ENUM_USER_ROLE.ADMIN) {
        const deletedUser = yield prisma_1.default.user.findFirst({
            where: {
                id,
            },
        });
        if ((deletedUser === null || deletedUser === void 0 ? void 0 : deletedUser.role) === user_1.ENUM_USER_ROLE.ADMIN) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "You cannot delete Admin");
        }
        if ((deletedUser === null || deletedUser === void 0 ? void 0 : deletedUser.role) === user_1.ENUM_USER_ROLE.HOUSE_OWNER ||
            (deletedUser === null || deletedUser === void 0 ? void 0 : deletedUser.role) === user_1.ENUM_USER_ROLE.HOUSE_RENTER) {
            const result = yield prisma_1.default.user.delete({
                where: {
                    id,
                },
            });
            return result;
        }
    }
});
exports.UserService = {
    createUser,
    createAdmin,
    getAllFromDB,
    getByIdFromDB,
    updatMyProfile,
    makeAdmin,
    deleteUserInDB,
};
