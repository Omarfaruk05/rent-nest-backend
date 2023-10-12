import { z } from "zod";
import { Role } from "./user.constant";

const createUserZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required." }),
    email: z.string({ required_error: "Email is required." }).email(),
    password: z.string({ required_error: "Password is required." }),
    role: z.enum([...Role] as [string, ...string[]], {
      required_error: "Role must be HOUSE_RENTER or HOUSE_OWNER",
    }),
    contactNumber: z.string({ required_error: "Contact number is required." }),
  }),
});

const createAdminZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required." }),
    email: z.string({ required_error: "Email is required." }).email(),
    password: z.string({ required_error: "Password is required." }),
    role: z
      .enum(["ADMIN"] as [string, ...string[]], {
        required_error: "Role must be HOUSE_RENTER or HOUSE_OWNER",
      })
      .optional(),
    contactNumber: z.string({ required_error: "Contact number is required." }),
  }),
});

export const UserValidation = {
  createUserZodSchema,
  createAdminZodSchema,
};
