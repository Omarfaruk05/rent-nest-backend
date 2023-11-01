import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { FaqController } from "./faq.controller";
import { FaqValidation } from "./faq.validation";

const router = express.Router();

//creat faq
router.post(
  "/",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(FaqValidation.createFaqZodSchema),
  FaqController.insertIntoDB
);

// get all faqs
router.get("/", FaqController.getAllFromDB);
// get single faq
router.get("/:id", FaqController.getByIdFromDB);

//update faq info
router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(FaqValidation.updateFaqZodSchema),
  FaqController.updateOneInDB
);

// delete faq
router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),

  FaqController.deleteByIdFromDB
);

export const FaqRoutes = router;
