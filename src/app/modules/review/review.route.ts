import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { ReviewController } from "./review.controller";
import { ReviewValidation } from "./review.validation";

const router = express.Router();

// create review
router.post(
  "/",
  auth(ENUM_USER_ROLE.HOUSE_RENTER, ENUM_USER_ROLE.HOUSE_OWNER),
  validateRequest(ReviewValidation.createReviewZodSchema),
  ReviewController.insertIntoDB
);

// get all reviews
router.get("/", ReviewController.getAllFromDB);

// update review info
router.patch(
  "/:id",
  auth(
    ENUM_USER_ROLE.HOUSE_OWNER,
    ENUM_USER_ROLE.HOUSE_RENTER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  validateRequest(ReviewValidation.updateReviewZodSchema),
  ReviewController.updateOneInDB
);

// delete reviews
router.delete(
  "/:id",
  auth(
    ENUM_USER_ROLE.HOUSE_OWNER,
    ENUM_USER_ROLE.HOUSE_RENTER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  ReviewController.deleteByIdFromDB
);

export const ReviewRoutes = router;
