import { z } from "zod";

const createBlogZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "Title is Required." }),
    blog: z.string({ required_error: "Blog is Required." }),
  }),
});

const updateBlogZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    blog: z.string().optional(),
  }),
});

export const BlogValidation = {
  createBlogZodSchema,
  updateBlogZodSchema,
};
