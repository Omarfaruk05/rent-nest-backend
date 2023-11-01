import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../../shared/pick";
import { BlogService } from "./blog.service";
import { blogFilterableFields } from "./blog.constant";
import { paginationConstantOptions } from "../../../constants/paginationConstants";

//create blog
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const result = await BlogService.insertIntoDB(req.body, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog Created Successfully!",
    data: result,
  });
});

//get all blogs
const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, paginationConstantOptions);
  const filters = pick(req.query, blogFilterableFields);

  const result = await BlogService.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blogs fetched Successfully!",
    meta: result.meta,
    data: result.data,
  });
});

//get single blog
const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await BlogService.getByIdFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog fetched Successfully!",
    data: result,
  });
});

//update blog
const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const { id } = req.params;
  const result = await BlogService.updateOneInDB(id, req.body, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog Updated Successfully!",
    data: result,
  });
});

// delete blog
const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const { id } = req.params;

  const result = await BlogService.deleteByIdFromDB(id, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog Deleted Successfully!",
    data: result,
  });
});

export const BlogController = {
  insertIntoDB,
  getByIdFromDB,
  getAllFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
