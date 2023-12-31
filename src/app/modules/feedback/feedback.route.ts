import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { FeedbackController } from "./feedback.controller";
import { FeedbackValidation } from "./feedback.validation";

const router = express.Router();

// create feedback
router.post(
  "/",
  auth(ENUM_USER_ROLE.HOUSE_RENTER, ENUM_USER_ROLE.HOUSE_OWNER),
  validateRequest(FeedbackValidation.createFeedbackZodSchema),
  FeedbackController.insertIntoDB
);

// get all feedbacks
router.get("/", FeedbackController.getAllFromDB);
// get single feedback
router.get("/:id", FeedbackController.getByIdFromDB);

// update feedback
router.patch(
  "/:id",
  auth(
    ENUM_USER_ROLE.HOUSE_OWNER,
    ENUM_USER_ROLE.HOUSE_RENTER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  validateRequest(FeedbackValidation.updateFeedbackZodSchema),
  FeedbackController.updateOneInDB
);

// delete feedback
router.delete(
  "/:id",
  auth(
    ENUM_USER_ROLE.HOUSE_OWNER,
    ENUM_USER_ROLE.HOUSE_RENTER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),

  FeedbackController.deleteByIdFromDB
);

export const FeedbackRoutes = router;
