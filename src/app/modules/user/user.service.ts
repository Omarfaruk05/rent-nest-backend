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
import { ENUM_USER_ROLE } from "../../../enums/user";

//create user service
const createUser = async (
  data: HouseOwner | HouseRenter
): Promise<User | undefined> => {
  data.password = await bcrypt.hash(
    data.password,
    Number(config.bycrypt_salt_rounds)
  );

  const isUserExist = await prisma.user.findFirst({
    where: {
      email: data?.email,
    },
  });

  if (isUserExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "This is email is already used!"
    );
  }

  if (data.role === ENUM_USER_ROLE.HOUSE_OWNER) {
    await prisma.houseOwner.create({ data });
    return await prisma.user.create({
      data,
    });
  }
  if (data.role === ENUM_USER_ROLE.HOUSE_RENTER) {
    await prisma.houseRenter.create({
      data,
    });
    return await prisma.user.create({ data });
  }
};

//get all user service
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

// get single user info
const getByIdFromDB = async (id: string): Promise<User | null> => {
  const result = await prisma.user.findFirst({
    where: {
      id,
    },
  });

  return result;
};

// update single user info
const updatMyProfile = async (
  id: string,
  data: Partial<User>
): Promise<User> => {
  const result = await prisma.user.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

// update user into admin
const makeAdmin = async (
  id: string,
  data: Partial<User>,
  user: any
): Promise<User> => {
  const { id: useId, role } = user;

  if (
    role === ENUM_USER_ROLE.HOUSE_OWNER ||
    role === ENUM_USER_ROLE.HOUSE_RENTER
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Only admin and super admin can make admin"
    );
  }

  const result = await prisma.user.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

// delete user
const deleteUserInDB = async (
  id: string,
  userRole: string
): Promise<User | null | undefined> => {
  const isUserExist = await prisma.user.findFirst({
    where: {
      id,
    },
  });

  if (
    (isUserExist && isUserExist.role === ENUM_USER_ROLE.HOUSE_RENTER) ||
    isUserExist?.role === ENUM_USER_ROLE.HOUSE_OWNER ||
    isUserExist?.role === ENUM_USER_ROLE.ADMIN
  ) {
    await prisma.bookedHouse.deleteMany({
      where: {
        user: {
          email: isUserExist.email,
        },
      },
    });
  }
  if (
    (isUserExist && isUserExist.role === ENUM_USER_ROLE.HOUSE_RENTER) ||
    isUserExist?.role === ENUM_USER_ROLE.HOUSE_OWNER ||
    isUserExist?.role === ENUM_USER_ROLE.ADMIN
  ) {
    await prisma.reviewAndRating.deleteMany({
      where: {
        user: {
          email: isUserExist.email,
        },
      },
    });
  }
  if (
    (isUserExist && isUserExist.role === ENUM_USER_ROLE.HOUSE_RENTER) ||
    isUserExist?.role === ENUM_USER_ROLE.HOUSE_OWNER ||
    isUserExist?.role === ENUM_USER_ROLE.ADMIN
  ) {
    await prisma.houseVisit.deleteMany({
      where: {
        visitor: {
          email: isUserExist.email,
        },
      },
    });
  }
  if (
    (isUserExist && isUserExist.role === ENUM_USER_ROLE.HOUSE_RENTER) ||
    isUserExist?.role === ENUM_USER_ROLE.HOUSE_OWNER ||
    isUserExist?.role === ENUM_USER_ROLE.ADMIN
  ) {
    await prisma.feedback.deleteMany({
      where: {
        user: {
          email: isUserExist.email,
        },
      },
    });
  }
  if (
    (isUserExist && isUserExist.role === ENUM_USER_ROLE.HOUSE_RENTER) ||
    isUserExist?.role === ENUM_USER_ROLE.HOUSE_OWNER ||
    isUserExist?.role === ENUM_USER_ROLE.ADMIN
  ) {
    await prisma.addToCart.deleteMany({
      where: {
        user: {
          email: isUserExist.email,
        },
      },
    });
  }

  if (
    (isUserExist && isUserExist.role === ENUM_USER_ROLE.HOUSE_RENTER) ||
    isUserExist?.role === ENUM_USER_ROLE.HOUSE_OWNER ||
    isUserExist?.role === ENUM_USER_ROLE.ADMIN
  ) {
    await prisma.house.deleteMany({
      where: {
        ownerId: isUserExist.id,
      },
    });
  }

  if (
    (isUserExist && isUserExist.role === ENUM_USER_ROLE.HOUSE_RENTER) ||
    isUserExist?.role === ENUM_USER_ROLE.HOUSE_OWNER ||
    isUserExist?.role === ENUM_USER_ROLE.ADMIN
  ) {
    await prisma.feedback.deleteMany({
      where: {
        userId: isUserExist.id,
      },
    });
  }
  if (
    (isUserExist && isUserExist.role === ENUM_USER_ROLE.HOUSE_RENTER) ||
    isUserExist?.role === ENUM_USER_ROLE.HOUSE_OWNER ||
    isUserExist?.role === ENUM_USER_ROLE.ADMIN
  ) {
    await prisma.reviewAndRating.deleteMany({
      where: {
        userId: isUserExist.id,
      },
    });
  }

  //super admin and admin
  if (isUserExist && userRole === ENUM_USER_ROLE.SUPER_ADMIN) {
    const result = await prisma.user.delete({
      where: {
        id,
      },
    });

    return result;
  }

  if (userRole === ENUM_USER_ROLE.ADMIN) {
    const deletedUser = await prisma.user.findFirst({
      where: {
        id,
      },
    });
    if (deletedUser?.role === ENUM_USER_ROLE.ADMIN) {
      throw new ApiError(httpStatus.BAD_REQUEST, "You cannot delete Admin");
    }

    if (
      deletedUser?.role === ENUM_USER_ROLE.HOUSE_OWNER ||
      deletedUser?.role === ENUM_USER_ROLE.HOUSE_RENTER
    ) {
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
  getAllFromDB,
  getByIdFromDB,
  updatMyProfile,
  makeAdmin,
  deleteUserInDB,
};
