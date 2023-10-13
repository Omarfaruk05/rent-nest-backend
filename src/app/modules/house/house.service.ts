import { House, Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import { HouseSearchableFields } from "./house.constant";
import { IGenericResponse } from "../../../interfaces/common";

//create house
const insertIntoDB = async (user: any, homeData: House): Promise<House> => {
  const { id, email, role } = user;

  const isHouseOwner = await prisma.user.findFirst({
    where: {
      id,
    },
  });

  if (!isHouseOwner || isHouseOwner.role != "HOUSE_OWNER") {
    throw new ApiError(httpStatus.NOT_FOUND, "You are not authorized owner.");
  }

  homeData.ownerId = id;
  homeData.availabilityDate = new Date(homeData?.availabilityDate);

  const result = await prisma.house.create({
    data: homeData,
  });

  return result;
};

//get all houses
const getAllFromDB = async (
  filters: any,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<House[]>> => {
  const { limit, page, skip } =
    paginationHelpers.calculatePagination(paginationOptions);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: HouseSearchableFields.map((field) => ({
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

  const whereConditions: Prisma.HouseWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  console.log(andConditions);
  const result = await prisma.house.findMany({
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
  const total = await prisma.house.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

// get single House service
const getByIdFromDB = async (id: string): Promise<House | null> => {
  const result = await prisma.house.findUnique({
    where: {
      id,
    },
    include: {
      owner: true,
    },
  });
  if (!result) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Sorry, There is no House with this id."
    );
  }

  return result;
};

// update House service
const updateOneInDB = async (
  id: string,
  user: any,
  updatedData: Partial<House>
): Promise<House | null> => {
  const { id: userId }: any = user;
  const house = await prisma.house.findFirst({
    where: {
      id,
      ownerId: userId,
    },
  });

  if (!house) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Can't update the house because this is not your house."
    );
  }

  const result = await prisma.house.update({
    where: {
      id,
    },
    data: updatedData,
  });

  return result;
};

// delete House service
const deleteByIdFromDB = async (
  id: string,
  user: any
): Promise<House | null> => {
  const { id: userId, role }: any = user;

  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    const result = await prisma.house.delete({
      where: {
        id,
      },
    });

    return result;
  } else {
    const house = await prisma.house.findFirst({
      where: {
        id,
        ownerId: userId,
      },
    });

    if (!house) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Can't delete the house because this is not your house."
      );
    }

    const result = await prisma.house.delete({
      where: {
        id,
      },
    });

    return result;
  }
};

export const HouseService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
