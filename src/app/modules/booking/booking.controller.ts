import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { BookingService } from "./booking.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../../shared/pick";
import { bookingFilterableFields } from "./booking.constant";
import { paginationConstantOptions } from "../../../constants/paginationConstants";

//create booking
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const result = await BookingService.insertIntoDB(req.body, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "House booking Created Successfully!",
    data: result,
  });
});

// get all bookings
const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;

  const options = pick(req.query, paginationConstantOptions);
  const filters = pick(req.query, bookingFilterableFields);

  const result = await BookingService.getAllFromDB(filters, options, user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Houses fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

//get single booking
const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user as any;
  const result = await BookingService.getByIdFromDB(id, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "House booking fetched successfully!",
    data: result,
  });
});

// update booking
const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user as any;

  const result = await BookingService.updateOneInDB(id, req.body, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "House booking updated successfully!",
    data: result,
  });
});

// delete booking
const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user as any;

  const result = await BookingService.deleteByIdFromDB(id, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "House booking canceled successfully!",
    data: result,
  });
});

export const BookingController = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
