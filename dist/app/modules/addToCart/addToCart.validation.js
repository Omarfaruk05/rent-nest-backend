"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddToCartValidation = void 0;
const zod_1 = require("zod");
const createAddToCartZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        houseId: zod_1.z.string({ required_error: "House id is Required." }),
    }),
});
const updateAddToCartZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        houseId: zod_1.z.string().optional(),
    }),
});
exports.AddToCartValidation = {
    createAddToCartZodSchema,
    updateAddToCartZodSchema,
};
