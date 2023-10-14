import { House, HouseVisit } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { bookingSlots } from "./houseVisit.constant";
import { ENUM_USER_ROLE } from "../../../enums/user";

const insertIntoDB = async (
  data: HouseVisit,
  user: any
): Promise<HouseVisit> => {
  const { id } = user;

  data["visitorId"] = id;
  data.visitDate = data.visitDate.toString().split("T")[0];
  console.log(data.visitDate);

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

  const result = await prisma.houseVisit.create({
    data,
  });
  return result;
};

const getAllFromDB = async (user: any): Promise<HouseVisit[]> => {
  const { id: userId, role } = user;

  if (
    role === ENUM_USER_ROLE.HOUSE_OWNER ||
    role === ENUM_USER_ROLE.HOUSE_RENTER
  ) {
    const result = await prisma.houseVisit.findMany({
      where: {
        visitorId: userId,
      },
    });

    return result;
  }

  const result = await prisma.houseVisit.findMany({});

  return result;
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

export const cenceleHouseVisit = async (id: string) => {
  const result = await prisma.houseVisit.delete({
    where: {
      id,
    },
  });

  return result;
};

export const HouseVisitService = {
  insertIntoDB,
  getAllFromDB,
  getAvailableSlods,
  cenceleHouseVisit,
};
