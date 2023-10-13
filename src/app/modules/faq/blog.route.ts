import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { FaqController } from "./faq.controller";
import { FaqValidation } from "./faq.validation";

const router = express.Router();

router.post(
  "/",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(FaqValidation.createFaqZodSchema),
  FaqController.insertIntoDB
);

router.get("/", FaqController.getAllFromDB);
router.get("/:id", FaqController.getByIdFromDB);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(FaqValidation.updateFaqZodSchema),
  FaqController.updateOneInDB
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),

  FaqController.deleteByIdFromDB
);

export const FaqRoutes = router;
