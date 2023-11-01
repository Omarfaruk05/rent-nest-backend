import { Faq, Prisma } from "@prisma/client";
import { ENUM_USER_ROLE } from "../../../enums/user";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import { faqFilterableFields } from "./faq.constant";

// creat faq service
const insertIntoDB = async (data: Faq, user: any): Promise<Faq> => {
  const { id, role } = user;

  if (
    role === ENUM_USER_ROLE.HOUSE_OWNER ||
    role === ENUM_USER_ROLE.HOUSE_RENTER
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Only ADMIN and SUPER ADMIN can create faq."
    );
  }

  data["userId"] = id;

  const result = await prisma.faq.create({
    data,
    include: {
      user: true,
    },
  });

  return result;
};

// get all faq service
const getAllFromDB = async (
  filters: any,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Faq[]>> => {
  const { limit, page, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: faqFilterableFields.map((field) => ({
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

  const whereConditions: Prisma.FaqWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.faq.findMany({
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

  const total = await prisma.faq.count({});

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

//get single faq service
const getByIdFromDB = async (id: string): Promise<Faq | null> => {
  const result = await prisma.faq.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });

  return result;
};

//   update faq service
const updateOneInDB = async (
  id: string,
  data: Partial<Faq>,
  user: any
): Promise<Faq> => {
  const { id: userId, role } = user;

  const faq = await prisma.faq.findFirst({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });
  if (userId !== faq?.userId) {
    if (role !== ENUM_USER_ROLE.SUPER_ADMIN) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Only Super Admin and faq crator can update faq."
      );
    }
  }

  const result = await prisma.faq.update({
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

//   delete faq service
const deleteByIdFromDB = async (
  id: string,
  user: any
): Promise<Faq | undefined> => {
  const { id: userId, role } = user;

  const deletedFaq = await prisma.faq.findFirst({
    where: {
      id,
    },
  });

  if (deletedFaq?.userId !== userId) {
    if (role !== ENUM_USER_ROLE.SUPER_ADMIN) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Only Super Admin and faq crator can delete faq."
      );
    }
  }

  const result = await prisma.faq.delete({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });

  return result;
};
export const FaqService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
