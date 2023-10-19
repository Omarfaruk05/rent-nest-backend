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
exports.BookingService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
const user_1 = require("../../../enums/user");
const insertIntoDB = (data, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = user;
    data.userId = id;
    if (id !== data.userId) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "It is not your userId");
    }
    const isUserExist = yield prisma_1.default.user.findFirst({
        where: {
            id,
        },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User does not exist.");
    }
    if ((isUserExist.role != user_1.ENUM_USER_ROLE.HOUSE_RENTER,
        isUserExist.role !== user_1.ENUM_USER_ROLE.HOUSE_OWNER)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Only house renter and house owner can book house.");
    }
    const isHouseExist = yield prisma_1.default.house.findFirst({
        where: {
            id: data === null || data === void 0 ? void 0 : data.houseId,
        },
    });
    if (!isHouseExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "House does not exist.");
    }
    const isBookedHouseExist = yield prisma_1.default.bookedHouse.findFirst({
        where: {
            userId: id,
            houseId: data.houseId,
        },
    });
    if (!isBookedHouseExist) {
        const result = yield prisma_1.default.bookedHouse.create({
            data,
            include: {
                house: true,
                user: true,
            },
        });
        return result;
    }
    const result = yield prisma_1.default.bookedHouse.create({
        data,
        include: {
            house: true,
            user: true,
        },
    });
    return result;
});
//get all bookings
const getAllFromDB = (filters, paginationOptions, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId, email, role } = user;
    const { limit, page, skip } = paginationHelpers_1.paginationHelpers.calculatePagination(paginationOptions);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
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
    if (role === user_1.ENUM_USER_ROLE.HOUSE_RENTER) {
        andConditions.push({
            AND: [
                {
                    userId: {
                        equals: userId,
                    },
                },
            ],
        });
    }
    if (role === user_1.ENUM_USER_ROLE.HOUSE_OWNER) {
        andConditions.push({
            AND: [
                {
                    house: {
                        ownerId: userId,
                    },
                },
            ],
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.bookedHouse.findMany({
        include: {
            user: true,
            house: {
                include: {
                    owner: true,
                },
            },
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
    const total = yield prisma_1.default.bookedHouse.count({
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
const getByIdFromDB = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId, email, role } = user;
    const isUserExist = yield prisma_1.default.user.findFirst({
        where: {
            id: userId,
            email,
            role,
        },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User does not exist.");
    }
    if (isUserExist.role === user_1.ENUM_USER_ROLE.ADMIN ||
        isUserExist.role === user_1.ENUM_USER_ROLE.SUPER_ADMIN) {
        return yield prisma_1.default.bookedHouse.findUnique({
            include: {
                user: true,
                house: {
                    include: {
                        owner: true,
                    },
                },
            },
            where: {
                id,
            },
        });
    }
    else if (isUserExist.role === user_1.ENUM_USER_ROLE.HOUSE_OWNER) {
        return yield prisma_1.default.bookedHouse.findUnique({
            include: {
                user: true,
                house: {
                    include: {
                        owner: true,
                    },
                },
            },
            where: {
                id,
                house: {
                    ownerId: userId,
                },
            },
        });
    }
    else if (isUserExist.role === user_1.ENUM_USER_ROLE.HOUSE_RENTER) {
        return yield prisma_1.default.bookedHouse.findUnique({
            include: {
                user: true,
                house: {
                    include: {
                        owner: true,
                    },
                },
            },
            where: {
                id,
                userId,
            },
        });
    }
});
const updateOneInDB = (id, data, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId, role, email } = user;
    const isUserExist = yield prisma_1.default.user.findFirst({
        where: {
            id: userId,
            email,
            role,
        },
    });
    const isBookingExist = yield prisma_1.default.bookedHouse.findFirst({
        where: {
            id,
        },
        include: {
            user: true,
            house: {
                include: {
                    owner: true,
                },
            },
        },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User does not exist.");
    }
    if (!isBookingExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "There is no booking in this id.");
    }
    if (isUserExist.role === user_1.ENUM_USER_ROLE.ADMIN ||
        isUserExist.role === user_1.ENUM_USER_ROLE.SUPER_ADMIN) {
        yield prisma_1.default.house.update({
            where: {
                id: isBookingExist.houseId,
            },
            data: {
                status: "BOOKED",
            },
        });
        return yield prisma_1.default.bookedHouse.update({
            include: {
                user: true,
                house: {
                    include: {
                        owner: true,
                    },
                },
            },
            where: {
                id,
            },
            data,
        });
    }
    if (isUserExist.id === isBookingExist.house.ownerId) {
        yield prisma_1.default.house.update({
            where: {
                id: isBookingExist.houseId,
            },
            data: {
                status: "BOOKED",
            },
        });
        return yield prisma_1.default.bookedHouse.update({
            include: {
                user: true,
                house: {
                    include: {
                        owner: true,
                    },
                },
            },
            where: {
                id,
                house: {
                    ownerId: userId,
                },
            },
            data,
        });
    }
});
const deleteByIdFromDB = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId, role, email } = user;
    const isUserExist = yield prisma_1.default.user.findFirst({
        where: {
            id: userId,
            email,
            role,
        },
    });
    const isBookingExist = yield prisma_1.default.bookedHouse.findFirst({
        where: {
            id,
        },
        include: {
            user: true,
            house: {
                include: {
                    owner: true,
                },
            },
        },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User does not exist.");
    }
    if (!isBookingExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "There is no booking in this id.");
    }
    if (isUserExist.role === user_1.ENUM_USER_ROLE.ADMIN ||
        isUserExist.role === user_1.ENUM_USER_ROLE.SUPER_ADMIN) {
        yield prisma_1.default.house.update({
            where: {
                id: isBookingExist.houseId,
            },
            data: {
                status: "AVAILABLE",
            },
        });
        return yield prisma_1.default.bookedHouse.delete({
            where: {
                id,
            },
        });
    }
    if (isUserExist.id === isBookingExist.house.ownerId ||
        isUserExist.id === isBookingExist.userId) {
        yield prisma_1.default.house.update({
            where: {
                id: isBookingExist.houseId,
            },
            data: {
                status: "AVAILABLE",
            },
        });
        return yield prisma_1.default.bookedHouse.delete({
            where: {
                id,
            },
        });
    }
});
exports.BookingService = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    updateOneInDB,
    deleteByIdFromDB,
};
