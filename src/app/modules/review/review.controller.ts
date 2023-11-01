import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { ReviewService } from "./review.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../../shared/pick";
import { reviewFilterableFields } from "./review.constant";

// create review
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const result = await ReviewService.insertIntoDB(req.body, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review Created Successfully!",
    data: result,
  });
});

// get all reviews
const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, reviewFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await ReviewService.getAllFromDB(filter, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviews fetched Successfully!",
    meta: result.meta,
    data: result.data,
  });
});

// update review info
const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const { id } = req.params;
  const result = await ReviewService.updateOneInDB(id, req.body, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review Updated Successfully!",
    data: result,
  });
});

// delete review
const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const { id } = req.params;

  const result = await ReviewService.deleteByIdFromDB(id, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review Deleted Successfully!",
    data: result,
  });
});

export const ReviewController = {
  insertIntoDB,
  getAllFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
