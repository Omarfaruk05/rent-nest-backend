import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { BookingServic } from "./booking.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const result = await BookingServic.insertIntoDB(req.body, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "House booking Created Successfully!",
    data: result,
  });
});

//get all houses
//   const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
//     const filters = pick(req.query, HouseFilterableFields);
//     const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

//     const result = await HouseService.getAllFromDB(filters, options);
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "Houses fetched successfully",
//       meta: result.meta,
//       data: result.data,
//     });
//   });

//get single house
const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user as any;
  const result = await BookingServic.getByIdFromDB(id, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "House booking fetched successfully!",
    data: result,
  });
});

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user as any;

  const result = await BookingServic.updateOneInDB(id, req.body, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "House booking updated successfully!",
    data: result,
  });
});
const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user as any;

  const result = await BookingServic.deleteByIdFromDB(id, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "House booking canceled successfully!",
    data: result,
  });
});

export const BookingController = {
  insertIntoDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
