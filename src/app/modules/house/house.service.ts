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

  if (!isHouseOwner) {
    throw new ApiError(httpStatus.NOT_FOUND, "You are not authorized owner.");
  }

  homeData.ownerId = id;
  homeData.availabilityDate = new Date(homeData?.availabilityDate);

  const result = await prisma.house.create({
    data: homeData,
  });

  return result;
};

export const HouseService = {
  insertIntoDB,
};
