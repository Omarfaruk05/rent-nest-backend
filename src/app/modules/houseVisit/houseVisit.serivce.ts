import { House, HouseVisit } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { bookingSlots } from "./houseVisit.constant";
import { ENUM_USER_ROLE } from "../../../enums/user";

const insertIntoDB = async (
  data: HouseVisit,
  user: any
): Promise<HouseVisit | undefined> => {
  const { id, role } = user;

  data["visitorId"] = id;
  data.visitDate = data.visitDate.toString().split("T")[0];

  const isExistVisitSlot = await prisma.houseVisit.findMany({
    where: {
      houseId: data?.houseId,
      visitDate: data?.visitDate,
      visitSlot: data?.visitSlot,
    },
  });

  if (isExistVisitSlot.length) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Visiting slot is not available."
    );
  }

  if (role === ENUM_USER_ROLE.ADMIN || role === ENUM_USER_ROLE.SUPER_ADMIN) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Only house Renter and house owner can create visit House."
    );
  }
  if (
    role === ENUM_USER_ROLE.HOUSE_RENTER ||
    role === ENUM_USER_ROLE.HOUSE_OWNER
  ) {
    const result = await prisma.houseVisit.create({
      data,
    });
    return result;
  }
};

const getAllFromDB = async (user: any): Promise<HouseVisit[] | undefined> => {
  const { id: userId, role } = user;

  if (role === ENUM_USER_ROLE.ADMIN || role === ENUM_USER_ROLE.SUPER_ADMIN) {
    const result = await prisma.houseVisit.findMany({
      include: {
        house: true,
        visitor: true,
      },
    });

    return result;
  } else if (role === ENUM_USER_ROLE.HOUSE_OWNER) {
    const result = await prisma.houseVisit.findMany({
      include: {
        house: true,
        visitor: true,
      },
      where: {
        house: {
          ownerId: userId,
        },
      },
    });

    return result;
  } else if (role === ENUM_USER_ROLE.HOUSE_RENTER) {
    const result = await prisma.houseVisit.findMany({
      include: {
        house: true,
        visitor: true,
      },
      where: {
        visitorId: userId,
      },
    });

    return result;
  }
};

const getAvailableSlods = async (houseId: any, date: any) => {
  date = date.split("T")[0];

  const bookedSlots = await prisma.houseVisit.findMany({
    where: {
      houseId,
      visitDate: date,
    },
  });

  if (bookedSlots) {
    const bookedSlot: string[] = bookedSlots.map((bookedSlot) => {
      return bookedSlot.visitSlot;
    });

    const availableSlot = bookingSlots.filter(
      (slot) => !bookedSlot.includes(slot)
    );
    return availableSlot;
  }
};

export const cenceleHouseVisit = async (id: string, user: any) => {
  const { id: userId, role } = user as any;

  if (role === ENUM_USER_ROLE.HOUSE_RENTER) {
    const isHouseVisitExist = await prisma.houseVisit.findMany({
      where: {
        visitorId: userId,
      },
    });
    if (!isHouseVisitExist.length) {
      throw new ApiError(httpStatus.NOT_FOUND, "You have not House visit ");
    }

    if (isHouseVisitExist.some((house) => house.visitorId === userId)) {
      const result = await prisma.houseVisit.delete({
        where: {
          id,
        },
      });

      return result;
    }
  }

  if (role === ENUM_USER_ROLE.HOUSE_OWNER) {
    const isHouseVisitExist = await prisma.houseVisit.findMany({
      where: {
        house: {
          ownerId: userId,
        },
      },
      include: {
        house: {
          include: {
            owner: true,
          },
        },
      },
    });
    if (!isHouseVisitExist.length) {
      throw new ApiError(httpStatus.NOT_FOUND, "You have not House visit ");
    }

    if (isHouseVisitExist.some((house) => house.house.ownerId === userId)) {
      const result = await prisma.houseVisit.delete({
        where: {
          id,
        },
      });

      return result;
    }
  }
  if (role === ENUM_USER_ROLE.ADMIN || role === ENUM_USER_ROLE.SUPER_ADMIN) {
    const result = await prisma.houseVisit.delete({
      where: {
        id,
      },
    });

    return result;
  }
};

export const HouseVisitService = {
  insertIntoDB,
  getAllFromDB,
  getAvailableSlods,
  cenceleHouseVisit,
};
