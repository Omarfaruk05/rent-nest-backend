import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { HouseVisitController } from "./houseVisit.controller";
import { HouseVisitValidation } from "./houseVisit.validation";

const router = express.Router();

router.post(
  "/",
  auth(ENUM_USER_ROLE.HOUSE_RENTER, ENUM_USER_ROLE.HOUSE_OWNER),
  validateRequest(HouseVisitValidation.createHouseVisitodSchema),
  HouseVisitController.insertIntoDB
);
router.get(
  "/",
  auth(
    ENUM_USER_ROLE.HOUSE_RENTER,
    ENUM_USER_ROLE.HOUSE_OWNER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  HouseVisitController.getAllFromDB
);
router.get("/slots", HouseVisitController.getAvalilableSlods);
router.delete("/:id", HouseVisitController.cenceleHouseVisit);

export const HouseVisitRoutes = router;
