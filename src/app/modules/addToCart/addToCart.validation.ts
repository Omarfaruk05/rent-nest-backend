import { z } from "zod";

const createAddToCartZodSchema = z.object({
  body: z.object({
    houseId: z.string({ required_error: "House id is Required." }),
  }),
});

const updateAddToCartZodSchema = z.object({
  body: z.object({
    houseId: z.string().optional(),
  }),
});

export const AddToCartValidation = {
  createAddToCartZodSchema,
  updateAddToCartZodSchema,
};
