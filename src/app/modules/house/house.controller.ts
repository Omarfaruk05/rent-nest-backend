import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { HouseService } from "./house.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../../shared/pick";
import { HouseFilterableFields } from "./house.constant";

// create house
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const result = await HouseService.insertIntoDB(user, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "House Created Successfully!",
    data: result,
  });
});

//get all houses
const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, HouseFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await HouseService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Houses fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

//get single house
const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user as any;
  const result = await HouseService.getByIdFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "House fetched successfully!",
    data: result,
  });
});

// update house info
const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user as any;

  const result = await HouseService.updateOneInDB(id, user, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "House updated successfully!",
    data: result,
  });
});

// delete house
const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user as any;

  const result = await HouseService.deleteByIdFromDB(id, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "House deleted successfully!",
    data: result,
  });
});

export const HouseController = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
