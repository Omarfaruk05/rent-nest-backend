import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { AddToCartController } from "./addToCart.controller";
import { AddToCartValidation } from "./addToCart.validation";

const router = express.Router();

router.post(
  "/",
  auth(
    ENUM_USER_ROLE.HOUSE_RENTER,
    ENUM_USER_ROLE.HOUSE_OWNER,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN
  ),
  validateRequest(AddToCartValidation.createAddToCartZodSchema),
  AddToCartController.insertIntoDB
);

router.get("/", AddToCartController.getAllFromDB);

router.patch(
  "/:id",
  auth(
    ENUM_USER_ROLE.HOUSE_OWNER,
    ENUM_USER_ROLE.HOUSE_RENTER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  validateRequest(AddToCartValidation.updateAddToCartZodSchema),
  AddToCartController.updateOneInDB
);

router.delete(
  "/:id",
  auth(
    ENUM_USER_ROLE.HOUSE_OWNER,
    ENUM_USER_ROLE.HOUSE_RENTER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  AddToCartController.deleteByIdFromDB
);

export const AddToCartRoutes = router;
