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

router.get("/", HouseController.getAllFromDB);
router.get("/:id", HouseController.getByIdFromDB);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.HOUSE_OWNER),
  validateRequest(HouseValidation.updateHouseZodSchema),
  HouseController.updateOneInDB
);
router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.HOUSE_OWNER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.ADMIN),

  HouseController.deleteByIdFromDB
);

export const HouseRoutes = router;
