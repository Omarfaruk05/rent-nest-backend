import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../../shared/pick";
import { AddToCartService } from "./addToCart.service";
import { addToCartFilterableFilds } from "./addToCart.constant";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const result = await AddToCartService.insertIntoDB(req.body, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cart Created Successfully!",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, addToCartFilterableFilds);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await AddToCartService.getAllFromDB(filter, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cart fetched Successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const { id } = req.params;
  const result = await AddToCartService.updateOneInDB(id, req.body, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cart Updated Successfully!",
    data: result,
  });
});

const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const { id } = req.params;

  const result = await AddToCartService.deleteByIdFromDB(id, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cart Deleted Successfully!",
    data: result,
  });
});

export const AddToCartController = {
  insertIntoDB,
  getAllFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
