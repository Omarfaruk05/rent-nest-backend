import { Response, Request } from "express";
import catchAsync from "../../../shared/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { UserFilterableFields } from "./user.constant";
import pick from "../../../shared/pick";

//create user
const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Created Successfully!",
    data: result,
  });
});

//get all user
const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, UserFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await UserService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

// get single user
const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user as any;
  const result = await UserService.getByIdFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User fetched Successfully!",
    data: result,
  });
});

// update user info
const updatMyProfile = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user as any;
  const result = await UserService.updatMyProfile(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Updated Successfully!",
    data: result,
  });
});

// make admin
const makeAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user as any;
  const result = await UserService.makeAdmin(id, req.body, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Updated Successfully!",
    data: result,
  });
});

// delete user
const deleteUserInDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.deleteUserInDB(id, req?.user?.role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User deleted Successfully!",
    data: result,
  });
});

export const UserController = {
  createUser,
  getAllFromDB,
  getByIdFromDB,
  updatMyProfile,
  makeAdmin,
  deleteUserInDB,
};
