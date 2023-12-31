import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../../shared/pick";
import { FaqService } from "./faq.service";
import { faqFilterableFields, faqQureyOptions } from "./faq.constant";

//create faq
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const result = await FaqService.insertIntoDB(req.body, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Faq Created Successfully!",
    data: result,
  });
});

// get all faqs
const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, faqFilterableFields);
  const options = pick(req.query, faqQureyOptions);

  const result = await FaqService.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Faqs Fetched Successfully!",
    meta: result.meta,
    data: result.data,
  });
});

// get single faq
const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await FaqService.getByIdFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Faq Fetched Successfully!",
    data: result,
  });
});

// update faq
const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const { id } = req.params;
  const result = await FaqService.updateOneInDB(id, req.body, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Faq Updated Successfully!",
    data: result,
  });
});

// delete faq
const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const { id } = req.params;

  const result = await FaqService.deleteByIdFromDB(id, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Faq Deleted Successfully!",
    data: result,
  });
});

export const FaqController = {
  insertIntoDB,
  getByIdFromDB,
  getAllFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
