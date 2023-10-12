import { BookedHouse } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

const insertIntoDB = async (
  data: BookedHouse,
  user: any
): Promise<BookedHouse> => {
  const { id, email, role } = user;

  if (id !== data.userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "It is not your userId");
  }

  const isUserExist = await prisma.user.findFirst({
    where: {
      id,
      email,
      role,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist.");
  }

  if (isUserExist.role != "HOUSE_RENTER") {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Only house renter can book house."
    );
  }

  const result = await prisma.bookedHouse.create({
    data,
  });

  return result;
};

const getByIdFromDB = async (
  id: string,
  user: any
): Promise<BookedHouse | null | undefined> => {
  const { id: userId, email, role } = user;

  const isUserExist = await prisma.user.findFirst({
    where: {
      id: userId,
      email,
      role,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist.");
  }

  if (isUserExist.role === "ADMIN" || isUserExist.role === "SUPER_ADMIN") {
    return await prisma.bookedHouse.findUnique({
      include: {
        user: true,
        house: {
          include: {
            owner: true,
          },
        },
      },
      where: {
        id,
      },
    });
  } else if (isUserExist.role === "HOUSE_OWNER") {
    return await prisma.bookedHouse.findUnique({
      include: {
        user: true,
        house: {
          include: {
            owner: true,
          },
        },
      },
      where: {
        id,
        house: {
          ownerId: userId,
        },
      },
    });
  } else if (isUserExist.role === "HOUSE_RENTER") {
    return await prisma.bookedHouse.findUnique({
      include: {
        user: true,
        house: {
          include: {
            owner: true,
          },
        },
      },
      where: {
        id,
        userId,
      },
    });
  }
};

const updateOneInDB = async (
  id: string,
  data: Partial<BookedHouse>,
  user: any
): Promise<BookedHouse | undefined | null> => {
  const { id: userId, role, email } = user;

  const isUserExist = await prisma.user.findFirst({
    where: {
      id: userId,
      email,
      role,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist.");
  }

  if (isUserExist.role === "ADMIN" || isUserExist.role === "SUPER_ADMIN") {
    return await prisma.bookedHouse.update({
      include: {
        user: true,
        house: {
          include: {
            owner: true,
          },
        },
      },
      where: {
        id,
      },
      data,
    });
  } else if (isUserExist.role === "HOUSE_OWNER") {
    return await prisma.bookedHouse.update({
      include: {
        user: true,
        house: {
          include: {
            owner: true,
          },
        },
      },
      where: {
        id,
        house: {
          ownerId: userId,
        },
      },
      data,
    });
  } else if (isUserExist.role === "HOUSE_RENTER") {
    return await prisma.bookedHouse.update({
      include: {
        user: true,
        house: {
          include: {
            owner: true,
          },
        },
      },
      where: {
        id,
        userId,
      },
      data,
    });
  }
};

const deleteByIdFromDB = async (
  id: string,
  user: any
): Promise<BookedHouse | undefined | null> => {
  const { id: userId, role, email } = user;

  const isUserExist = await prisma.user.findFirst({
    where: {
      id: userId,
      email,
      role,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist.");
  }

  if (isUserExist.role === "ADMIN" || isUserExist.role === "SUPER_ADMIN") {
    return await prisma.bookedHouse.delete({
      include: {
        user: true,
        house: {
          include: {
            owner: true,
          },
        },
      },
      where: {
        id,
      },
    });
  } else if (isUserExist.role === "HOUSE_OWNER") {
    return await prisma.bookedHouse.delete({
      include: {
        user: true,
        house: {
          include: {
            owner: true,
          },
        },
      },
      where: {
        id,
        house: {
          ownerId: userId,
        },
      },
    });
  } else if (isUserExist.role === "HOUSE_RENTER") {
    return await prisma.bookedHouse.delete({
      include: {
        user: true,
        house: {
          include: {
            owner: true,
          },
        },
      },
      where: {
        id,
        userId,
      },
    });
  }
};

export const BookingServic = {
  insertIntoDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
