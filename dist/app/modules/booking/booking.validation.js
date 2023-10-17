"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingValidation = void 0;
const zod_1 = require("zod");
const booking_constant_1 = require("./booking.constant");
const createBookingZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        houseId: zod_1.z.string({ required_error: "House ID is required" }),
        bookingStatus: zod_1.z
            .enum([...booking_constant_1.BookingStatus])
            .optional(),
    }),
});
const updateBookingZodSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        houseId: zod_1.z.string().optional(),
        bookingStatus: zod_1.z.enum([...booking_constant_1.BookingStatus]),
    })
        .optional(),
});
exports.BookingValidation = {
    createBookingZodSchema,
    updateBookingZodSchema,
};
