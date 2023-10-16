import { z } from "zod";
import { BookingStatus } from "./booking.constant";

const createBookingZodSchema = z.object({
  body: z.object({
    houseId: z.string({ required_error: "House ID is required" }),
    bookingStatus: z
      .enum([...BookingStatus] as [string, ...string[]])
      .optional(),
  }),
});

const updateBookingZodSchema = z.object({
  body: z
    .object({
      houseId: z.string().optional(),
      bookingStatus: z.enum([...BookingStatus] as [string, ...string[]]),
    })
    .optional(),
});

export const BookingValidation = {
  createBookingZodSchema,
  updateBookingZodSchema,
};
