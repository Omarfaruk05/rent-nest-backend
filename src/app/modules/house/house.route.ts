import express from "express";
import { HouseController } from "./house.controller";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { HouseValidation } from "./house.validation";

const router = express.Router();

router.post(
  "/",
  auth(ENUM_USER_ROLE.HOUSE_OWNER),
  validateRequest(HouseValidation.createHouseZodSchema),
  HouseController.insertIntoDB
);

export const HouseRoutes = router;
