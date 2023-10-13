import { ReviewAndRating } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import { IGenericResponse } from "../../../interfaces/common";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { ENUM_USER_ROLE } from "../../../enums/user";

const insertIntoDB = async (
  data: ReviewAndRating,
  user: any
): Promise<ReviewAndRating> => {
  const { id } = user;

  data["userId"] = id;

  const result = await prisma.reviewAndRating.create({
    data,
    include: {
      user: true,
      house: true,
    },
  });

  return result;
};

const getAllFromDB = async (
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ReviewAndRating[]>> => {
  const { limit, page, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const result = await prisma.reviewAndRating.findMany({
    include: {
      user: true,
      house: true,
    },
    skip,
    take: limit,
    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? { [paginationOptions.sortBy]: paginationOptions.sortOrder }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.reviewAndRating.count({});

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
  data: Partial<ReviewAndRating>,
  user: any
): Promise<ReviewAndRating> => {
  const { id: userId } = user;

  const review = await prisma.reviewAndRating.findFirst({
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

  const result = await prisma.reviewAndRating.update({
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

const deleteByIdFromDB = async (
  id: string,
  user: any
): Promise<ReviewAndRating> => {
  const { id: userId, role } = user;

  const review = await prisma.reviewAndRating.findFirst({
    where: {
      id,
    },
  });

  if (
    role === ENUM_USER_ROLE.ADMIN ||
    role === ENUM_USER_ROLE.SUPER_ADMIN ||
    userId === review?.userId
  ) {
    const result = await prisma.reviewAndRating.delete({
      where: {
        id,
      },
    });
    return result;
  } else {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Only reviewer, admin and super admin can delete"
    );
  }
};

export const ReviewService = {
  insertIntoDB,
  getAllFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
