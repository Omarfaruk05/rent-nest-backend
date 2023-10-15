import express from "express";
import { UserController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

router.post(
  "/create-user",
  validateRequest(UserValidation.createUserZodSchema),
  UserController.createUser
);
router.post(
  "/create-admin",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(UserValidation.createAdminZodSchema),
  UserController.createAdmin
);
router.get(
  "/",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  UserController.getAllFromDB
);
router.get(
  "/user",
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.HOUSE_OWNER,
    ENUM_USER_ROLE.HOUSE_RENTER
  ),
  UserController.getByIdFromDB
);
router.patch(
  "/update-profile",
  auth(ENUM_USER_ROLE.HOUSE_OWNER, ENUM_USER_ROLE.HOUSE_RENTER),
  UserController.updatMyProfile
);
router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  UserController.makeAdmin
);
router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  UserController.deleteUserInDB
);

export const UserRoutes = router;
