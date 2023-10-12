import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { HouseService } from "./house.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

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

export const HouseController = {
  insertIntoDB,
};
