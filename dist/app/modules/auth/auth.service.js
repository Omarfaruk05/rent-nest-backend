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
exports.AuthService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
//login user service
const loginUser = (loginData) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = loginData;
    const isUserExist = yield prisma_1.default.user.findFirst({
        where: {
            email,
        },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User does not exist.");
    }
    const isPasswordMatched = yield bcrypt_1.default.compare(password, isUserExist.password);
    if (isUserExist.password && !isPasswordMatched) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Password is incorrect.");
    }
    // generating access token
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ id: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.id, email: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.email, role: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    // generating refresh token
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ email: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.email, role: isUserExist.role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
//refresh token service
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_secret);
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Invalide Refresh Token");
    }
    //checking deleted user's refresh token
    const { email, role } = verifiedToken;
    let newAccessToken = "";
    if (role === "House Renter" || role === "House Owner") {
        const isUserExist = yield prisma_1.default.user.findFirst({
            where: {
                email,
            },
        });
        if (!isUserExist) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User does not exist.");
        }
        //generate new access token
        newAccessToken = jwtHelpers_1.jwtHelpers.createToken({ email: isUserExist.email, role: isUserExist.role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    }
    return {
        accessToken: newAccessToken,
    };
});
exports.AuthService = {
    loginUser,
    refreshToken,
};
