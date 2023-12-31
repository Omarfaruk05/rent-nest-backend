import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../../shared/pick";
import { FeedbackService } from "./feedback.service";
import { queryOptions } from "./feedback.constant";

//create feedback
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const result = await FeedbackService.insertIntoDB(req.body, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Feedback Created Successfully!",
    data: result,
  });
});

// get all feedback
const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, queryOptions);

  const result = await FeedbackService.getAllFromDB(options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Feedbacks fetched Successfully!",
    meta: result.meta,
    data: result.data,
  });
});

//get single feedbacks
const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await FeedbackService.getByIdFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Feedback fetched Successfully!",
    data: result,
  });
});

// update feedback
const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const { id } = req.params;
  const result = await FeedbackService.updateOneInDB(id, req.body, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Feedback Updated Successfully!",
    data: result,
  });
});

//delete feedback
const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const { id } = req.params;

  const result = await FeedbackService.deleteByIdFromDB(id, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Feedback Deleted Successfully!",
    data: result,
  });
});

export const FeedbackController = {
  insertIntoDB,
  getByIdFromDB,
  getAllFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
