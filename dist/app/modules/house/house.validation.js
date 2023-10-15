"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HouseValidation = void 0;
const zod_1 = require("zod");
const house_constant_1 = require("./house.constant");
const createHouseZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: "Name is required." }),
        address: zod_1.z.string({ required_error: "Address is required." }),
        city: zod_1.z.string({ required_error: "City is required." }),
        bedrooms: zod_1.z.number({ required_error: "Bedrooms is required." }),
        roomSize: zod_1.z.string({ required_error: "Room size is required." }),
        numberOfBalcony: zod_1.z.number({
            required_error: "Number of balcony is required.",
        }),
        parking: zod_1.z.number({ required_error: "Parking is required." }),
        propertyId: zod_1.z.string().optional(),
        yearBuilt: zod_1.z.number({ required_error: "Built Year is required." }),
        gas: zod_1.z.enum([...house_constant_1.GAS], {
            required_error: "GAS must be LPG or Govt",
        }),
        propertyType: zod_1.z.enum([...house_constant_1.PropertyType], {
            required_error: "Property type must be Furnished or Residential or Luxury",
        }),
        interior: zod_1.z.enum([...house_constant_1.Interior], {
            required_error: "Interior must be Furnished or Un_Furnished",
        }),
        status: zod_1.z.enum([...house_constant_1.Availabale], {
            required_error: "Role must be AVAILABLE or BOOKED",
        }),
        availabilityDate: zod_1.z.string({
            required_error: "Availity date is required.",
        }),
        rentPerMonth: zod_1.z.string({ required_error: "Rent per month is required." }),
        description: zod_1.z.string({ required_error: "Description is required." }),
        ownerId: zod_1.z.string({ required_error: "Owner id is required." }),
    }),
});
const updateHouseZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
        city: zod_1.z.string().optional(),
        bedrooms: zod_1.z.number().optional(),
        roomSize: zod_1.z.string().optional(),
        numberOfBalcony: zod_1.z.number().optional(),
        parking: zod_1.z.number().optional(),
        propertyId: zod_1.z.string().optional(),
        yearBuilt: zod_1.z.number().optional(),
        gas: zod_1.z.enum([...house_constant_1.GAS]).optional(),
        propertyType: zod_1.z.enum([...house_constant_1.PropertyType]).optional(),
        interior: zod_1.z.enum([...house_constant_1.Interior]).optional(),
        status: zod_1.z.enum([...house_constant_1.Availabale]).optional(),
        availabilityDate: zod_1.z.string().optional(),
        rentPerMonth: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        ownerId: zod_1.z.string().optional(),
    }),
});
exports.HouseValidation = {
    createHouseZodSchema,
    updateHouseZodSchema,
};
