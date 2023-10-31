import express from "express";
import { UserController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

//create user
router.post(
  "/create-user",
  validateRequest(UserValidation.createUserZodSchema),
  UserController.createUser
);

// get all user
router.get(
  "/",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  UserController.getAllFromDB
);
// get single user
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

// update user info
router.patch(
  "/update-profile",
  auth(
    ENUM_USER_ROLE.HOUSE_OWNER,
    ENUM_USER_ROLE.HOUSE_RENTER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  UserController.updatMyProfile
);
// make user into admin
router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  UserController.makeAdmin
);

// delete user
router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  UserController.deleteUserInDB
);

export const UserRoutes = router;
