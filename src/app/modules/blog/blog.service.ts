import { Blog, Prisma } from "@prisma/client";
import { ENUM_USER_ROLE } from "../../../enums/user";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import { blogFilterableFields } from "./blog.constant";

// creat blog
const insertIntoDB = async (data: Blog, user: any): Promise<Blog> => {
  const { id, role } = user;

  if (
    role === ENUM_USER_ROLE.HOUSE_OWNER ||
    role === ENUM_USER_ROLE.HOUSE_RENTER
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Only house ADMIN and SUPER ADMIN can create blog."
    );
  }

  data["userId"] = id;

  const result = await prisma.blog.create({
    data,
    include: {
      user: true,
    },
  });

  return result;
};

// get all blog
const getAllFromDB = async (
  filters: any,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Blog[]>> => {
  const { limit, page, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: blogFilterableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

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

  const whereConditions: Prisma.BlogWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.blog.findMany({
    include: {
      user: true,
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

  const total = await prisma.blog.count({});

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<Blog | null> => {
  const result = await prisma.blog.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });

  return result;
};

//   update blog
const updateOneInDB = async (
  id: string,
  data: Partial<Blog>,
  user: any
): Promise<Blog> => {
  const { id: userId, role } = user;

  const review = await prisma.blog.findFirst({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });

  if (userId !== review?.userId || role !== ENUM_USER_ROLE.SUPER_ADMIN) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Only Super Admin and blog crator can update blog."
    );
  }

  const result = await prisma.blog.update({
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
): Promise<Blog | undefined> => {
  const { id: userId, role } = user;

  const deletedBlog = await prisma.blog.findFirst({
    where: {
      id,
    },
  });

  if (deletedBlog?.userId !== userId) {
    if (role !== ENUM_USER_ROLE.SUPER_ADMIN) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Only Super Admin and blog crator can delete blog."
      );
    }
  }

  const result = await prisma.blog.delete({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });

  return result;
};
export const BlogService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
