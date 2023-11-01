import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { HouseVisitService } from "./houseVisit.serivce";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

// create house visit slot
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const result = await HouseVisitService.insertIntoDB(req.body, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "House visit Created Successfully!",
    data: result,
  });
});

// get all visiting slots
const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const result = await HouseVisitService.getAllFromDB(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "House visits fetched Successfully!",
    data: result,
  });
});

// get available house visiting slot
const getAvalilableSlods = catchAsync(async (req: Request, res: Response) => {
  const { date, houseId } = req.query;

  const result = await HouseVisitService.getAvailableSlods(houseId, date);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get Available Slots Successfully!",
    data: result,
  });
});

// delete house visit
const cenceleHouseVisit = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user as any;

  const result = await HouseVisitService.cenceleHouseVisit(id, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully canceled this house visit!",
    data: result,
  });
});

export const HouseVisitController = {
  insertIntoDB,
  getAllFromDB,
  getAvalilableSlods,
  cenceleHouseVisit,
};
