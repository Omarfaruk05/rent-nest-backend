import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { BookingValidation } from "./booking.validation";
import { BookingController } from "./booking.controller";

const router = express.Router();

router.post(
  "/",
  auth(ENUM_USER_ROLE.HOUSE_RENTER),
  validateRequest(BookingValidation.createBookingZodSchema),
  BookingController.insertIntoDB
);

// router.get("/", BookingController.getAllFromDB);
router.get(
  "/:id",
  auth(
    ENUM_USER_ROLE.HOUSE_OWNER,
    ENUM_USER_ROLE.HOUSE_RENTER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  BookingController.getByIdFromDB
);

router.patch(
  "/:id",
  auth(
    ENUM_USER_ROLE.HOUSE_OWNER,
    ENUM_USER_ROLE.HOUSE_RENTER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  validateRequest(BookingValidation.updateBookingZodSchema),
  BookingController.updateOneInDB
);
router.delete(
  "/:id",
  auth(
    ENUM_USER_ROLE.HOUSE_OWNER,
    ENUM_USER_ROLE.HOUSE_RENTER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),

  BookingController.deleteByIdFromDB
);

export const BookingRoutes = router;
