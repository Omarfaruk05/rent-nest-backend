import { House } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

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

// creat single House service
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
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
