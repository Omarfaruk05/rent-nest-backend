"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const user_constant_1 = require("./user.constant");
const createUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: "Name is required." }),
        email: zod_1.z.string({ required_error: "Email is required." }).email(),
        password: zod_1.z.string({ required_error: "Password is required." }),
        role: zod_1.z.enum([...user_constant_1.Role], {
            required_error: "Role must be HOUSE_RENTER or HOUSE_OWNER",
        }),
        contactNumber: zod_1.z.string({ required_error: "Contact number is required." }),
    }),
});
const createAdminZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: "Name is required." }),
        email: zod_1.z.string({ required_error: "Email is required." }).email(),
        password: zod_1.z.string({ required_error: "Password is required." }),
        role: zod_1.z.enum(["admin"], {
            required_error: "Role must be HOUSE_RENTER or HOUSE_OWNER",
        }),
        contactNumber: zod_1.z.string({ required_error: "Contact number is required." }),
    }),
});
exports.UserValidation = {
    createUserZodSchema,
    createAdminZodSchema,
};
