import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import config from "../../../config";
import { Admin, HouseOwner, HouseRenter, Prisma, User } from "@prisma/client";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { UserSearchableFields } from "./user.constant";
import { paginationHelpers } from "../../../helpers/paginationHelpers";

const createUser = async (
  data: HouseOwner | HouseRenter
): Promise<User | undefined> => {
  data.password = await bcrypt.hash(
    data.password,
    Number(config.bycrypt_salt_rounds)
  );

  if (data.role === "HOUSE_OWNER") {
    await prisma.houseOwner.create({ data });
    return await prisma.user.create({
      data,
    });
  }
  if (data.role === "HOUSE_RENTER") {
    await prisma.houseRenter.create({
      data,
    });
    return await prisma.user.create({ data });
  }
};

const createAdmin = async (data: Admin): Promise<User | undefined> => {
  data.password = await bcrypt.hash(
    data.password,
    Number(config.bycrypt_salt_rounds)
  );

  if (data.role !== "ADMIN") {
    throw new ApiError(httpStatus.BAD_REQUEST, "User role must be admin");
  }
  await await prisma.admin.create({
    data,
  });
  const result = prisma.user.create({ data });
  return result;
};

const getAllFromDB = async (
  filters: any,
  options: IPaginationOptions
): Promise<IGenericResponse<User[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: UserSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: (filterData as any)[key],
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {},
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });
  const totalPage = Math.ceil(total / limit);
  return {
    meta: {
      total: totalPage,
      page,
      limit,
    },
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<User | null> => {
  const result = await prisma.user.findFirst({
    where: {
      id,
    },
  });
  console.log(result);
  return result;
};

const deleteUserInDB = async (
  id: string,
  userRole: string
): Promise<User | null | undefined> => {
  if (userRole === "SUPER_ADMIN") {
    await prisma.admin.delete({
      where: {
        id,
      },
    });
    await prisma.houseOwner.delete({
      where: {
        id,
      },
    });

    await prisma.houseRenter.delete({
      where: {
        id,
      },
    });

    const result = await prisma.user.delete({
      where: {
        id,
      },
    });

    return result;
  }

  if (userRole === "ADMIN") {
    const deletedUser = await prisma.user.findFirst({
      where: {
        id,
      },
    });
    if (deletedUser?.role === "ADMIN") {
      throw new ApiError(httpStatus.BAD_REQUEST, "You cannot delete Admin");
    }

    if (
      deletedUser?.role === "HOUSE_OWNER" ||
      deletedUser?.role === "HOUSE_RENTER"
    ) {
      await prisma.houseOwner.delete({
        where: {
          id,
        },
      });

      await prisma.houseRenter.delete({
        where: {
          id,
        },
      });

      const result = await prisma.user.delete({
        where: {
          id,
        },
      });

      return result;
    }
  }
};

export const UserService = {
  createUser,
  createAdmin,
  getAllFromDB,
  getByIdFromDB,
  deleteUserInDB,
};
