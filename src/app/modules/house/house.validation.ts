import { GasStatus } from "@prisma/client";
import { z } from "zod";
import { Availabale, GAS, Interior, PropertyType } from "./house.constant";

const createHouseZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required." }),

    address: z.string({ required_error: "Address is required." }),

    city: z.string({ required_error: "City is required." }),

    bedrooms: z.number({ required_error: "Bedrooms is required." }),

    roomSize: z.string({ required_error: "Room size is required." }),

    numberOfBalcony: z.number({
      required_error: "Number of balcony is required.",
    }),

    parking: z.number({ required_error: "Parking is required." }),

    propertyId: z.string().optional(),

    yearBuilt: z.string({ required_error: "Built Year is required." }),

    gas: z.enum([...GAS] as [string, ...string[]], {
      required_error: "GAS must be LPG or Govt",
    }),

    propertyType: z.enum([...PropertyType] as [string, ...string[]], {
      required_error:
        "Property type must be Furnished or Residential or Luxury",
    }),

    interior: z.enum([...Interior] as [string, ...string[]], {
      required_error: "Interior must be Furnished or Un_Furnished",
    }),

    availabilityDate: z.string({
      required_error: "Availity date is required.",
    }),
    rentPerMonth: z.string({ required_error: "Rent per month is required." }),

    description: z.string({ required_error: "Description is required." }),
  }),
});

const updateHouseZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    bedrooms: z.number().optional(),
    roomSize: z.string().optional(),
    numberOfBalcony: z.number().optional(),
    parking: z.number().optional(),
    propertyId: z.string().optional(),
    yearBuilt: z.number().optional(),
    gas: z.enum([...GAS] as [string, ...string[]]).optional(),
    propertyType: z.enum([...PropertyType] as [string, ...string[]]).optional(),
    interior: z.enum([...Interior] as [string, ...string[]]).optional(),
    status: z.enum([...Availabale] as [string, ...string[]]).optional(),
    availabilityDate: z.string().optional(),
    rentPerMonth: z.string().optional(),
    description: z.string().optional(),
    ownerId: z.string().optional(),
  }),
});

export const HouseValidation = {
  createHouseZodSchema,
  updateHouseZodSchema,
};
