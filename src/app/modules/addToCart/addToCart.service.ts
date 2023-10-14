import { AddToCart, Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

const insertIntoDB = async (data: AddToCart, user: any): Promise<AddToCart> => {
  const { id: userId } = user;
  data["userId"] = userId;

  const result = await prisma.addToCart.create({
    data,
  });

  return result;
};

const getAllFromDB = async (
  filterData: any,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<AddToCart[]>> => {
  const { limit, page, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        return {
          [key]: {
            equals: (filterData as any)[key],
          },
        };
      }),
    });
  }

  const whereConditions: Prisma.AddToCartWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.addToCart.findMany({
    include: {
      user: true,
      house: true,
    },
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? { [paginationOptions.sortBy]: paginationOptions.sortOrder }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.addToCart.count({ where: whereConditions });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const updateOneInDB = async (
  id: string,
  data: Partial<AddToCart>,
  user: any
): Promise<AddToCart> => {
  const { id: userId } = user;

  const review = await prisma.addToCart.findFirst({
    where: {
      id,
    },
    include: {
      user: true,
      house: true,
    },
  });

  if (userId !== review?.userId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You cann't update this comment because it is not your comment."
    );
  }

  const result = await prisma.addToCart.update({
    where: {
      id,
    },
    data,
    include: {
      user: true,
      house: true,
    },
  });

  return result;
};

const deleteByIdFromDB = async (id: string, user: any): Promise<AddToCart> => {
  const { id: userId } = user;

  const review = await prisma.addToCart.findFirst({
    where: {
      id,
    },
  });

  if (userId === review?.userId) {
    const result = await prisma.addToCart.delete({
      where: {
        id,
      },
    });
    return result;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "You cann't delete this item.");
  }
};

export const AddToCartService = {
  insertIntoDB,
  getAllFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
