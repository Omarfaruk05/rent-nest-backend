import { Feedback } from "@prisma/client";
import { ENUM_USER_ROLE } from "../../../enums/user";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelpers";

// creat feedback
const insertIntoDB = async (data: Feedback, user: any): Promise<Feedback> => {
  const { id, role } = user;

  if (role === ENUM_USER_ROLE.ADMIN || role === ENUM_USER_ROLE.SUPER_ADMIN) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Only house renter and house owner can feedback."
    );
  }

  data["userId"] = id;

  const result = await prisma.feedback.create({
    data,
    include: {
      user: true,
    },
  });

  return result;
};

// get all feedback
const getAllFromDB = async (
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Feedback[]>> => {
  const { limit, page, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const result = await prisma.feedback.findMany({
    include: {
      user: true,
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

  const total = await prisma.feedback.count({});

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<Feedback | null> => {
  const result = await prisma.feedback.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });

  return result;
};

//   update feedback
const updateOneInDB = async (
  id: string,
  data: Partial<Feedback>,
  user: any
): Promise<Feedback> => {
  const { id: userId } = user;

  const review = await prisma.feedback.findFirst({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });

  if (userId !== review?.userId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You cann't update this comment because it is not your comment."
    );
  }

  const result = await prisma.feedback.update({
    where: {
      id,
    },
    data,
    include: {
      user: true,
    },
  });

  return result;
};

//   delete feedback
const deleteByIdFromDB = async (
  id: string,
  user: any
): Promise<Feedback | undefined> => {
  const { id: userId, role } = user;

  const deletedFeedback = await prisma.feedback.findFirst({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });

  if (
    role === ENUM_USER_ROLE.ADMIN ||
    role ||
    ENUM_USER_ROLE.SUPER_ADMIN ||
    userId === deletedFeedback?.userId
  ) {
    const result = await prisma.feedback.delete({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });

    return result;
  }
};
export const FeedbackService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
