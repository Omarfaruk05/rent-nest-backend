"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HouseVisitValidation = void 0;
const zod_1 = require("zod");
const houseVisit_constant_1 = require("./houseVisit.constant");
const createHouseVisitodSchema = zod_1.z.object({
    body: zod_1.z.object({
        visitDate: zod_1.z.string({ required_error: "Visit Date is Required." }),
        visitSlot: zod_1.z.enum([...houseVisit_constant_1.bookingSlots], {
            required_error: "VisitSlot is Required.",
        }),
        houseId: zod_1.z.string({ required_error: "House is Required." }),
    }),
});
exports.HouseVisitValidation = {
    createHouseVisitodSchema,
};
