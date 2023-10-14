import { z } from "zod";
import { bookingSlots } from "./houseVisit.constant";

const createHouseVisitodSchema = z.object({
  body: z.object({
    visitDate: z.string({ required_error: "Visit Date is Required." }),
    visitSlot: z.enum([...bookingSlots] as [string, ...string[]], {
      required_error: "VisitSlot is Required.",
    }),
    houseId: z.string({ required_error: "House is Required." }),
  }),
});

export const HouseVisitValidation = {
  createHouseVisitodSchema,
};
