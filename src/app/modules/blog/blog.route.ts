import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { BlogController } from "./blog.controller";
import { BlogValidation } from "./blog.validation";

const router = express.Router();

//create blog
router.post(
  "/",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(BlogValidation.createBlogZodSchema),
  BlogController.insertIntoDB
);

// get all blogs
router.get("/", BlogController.getAllFromDB);
// get single blog
router.get("/:id", BlogController.getByIdFromDB);

//update blog info
router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(BlogValidation.updateBlogZodSchema),
  BlogController.updateOneInDB
);

//delete  blog
router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),

  BlogController.deleteByIdFromDB
);

export const BlogRoutes = router;
