import { z } from "zod";

const createFeedbackZodSchema = z.object({
  body: z.object({
    feedback: z.string({ required_error: "Feedback is Required." }),
  }),
});

const updateFeedbackZodSchema = z.object({
  body: z.object({
    feedback: z.string().optional(),
  }),
});

export const FeedbackValidation = {
  createFeedbackZodSchema,
  updateFeedbackZodSchema,
};
