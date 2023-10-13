import { z } from "zod";

const createReviewZodSchema = z.object({
  body: z.object({
    review: z.string({ required_error: "Review is Required." }),
    rating: z.number({ required_error: "Rating is Required." }),
    houseId: z.string({ required_error: "House id is Required." }),
  }),
});

const updateReviewZodSchema = z.object({
  body: z.object({
    review: z.string().optional(),
    rating: z.number().optional(),
    houseId: z.string().optional(),
  }),
});

export const ReviewValidation = {
  createReviewZodSchema,
  updateReviewZodSchema,
};
