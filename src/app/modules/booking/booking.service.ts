import { BookedHouse, Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import { ENUM_USER_ROLE } from "../../../enums/user";

const insertIntoDB = async (
  data: BookedHouse,
  user: any
): Promise<BookedHouse> => {
  const { id } = user;

  data.userId = id;

  if (id !== data.userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "It is not your userId");
  }

  const isUserExist = await prisma.user.findFirst({
    where: {
      id,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist.");
  }

  if (isUserExist.role != ENUM_USER_ROLE.HOUSE_RENTER) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Only house renter can book house."
    );
  }
  const isHouseExist = await prisma.house.findFirst({
    where: {
      id: data?.houseId,
    },
  });
  if (!isHouseExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "House does not exist.");
  }

  const result = await prisma.bookedHouse.create({
    data,
    include: {
      house: true,
      user: true,
    },
  });

  return result;
};

//get all bookings
const getAllFromDB = async (
  filters: any,
  paginationOptions: IPaginationOptions,
  user: any
) => {
  const { id: userId, email, role } = user;

  const { limit, page, skip } =
    paginationHelpers.calculatePagination(paginationOptions);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

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

  if (role === ENUM_USER_ROLE.HOUSE_RENTER) {
    andConditions.push({
      AND: [
        {
          userId: {
            equals: userId,
          },
        },
      ],
    });
  }
  if (role === ENUM_USER_ROLE.HOUSE_OWNER) {
    andConditions.push({
      AND: [
        {
          house: {
            ownerId: userId,
          },
        },
      ],
    });
  }

  const whereConditions: Prisma.BookedHouseWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.bookedHouse.findMany({
    include: {
      user: true,
      house: {
        include: {
          owner: true,
        },
      },
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
  const total = await prisma.bookedHouse.count({
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

  if (
    isUserExist.role === ENUM_USER_ROLE.ADMIN ||
    isUserExist.role === ENUM_USER_ROLE.SUPER_ADMIN
  ) {
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
  } else if (isUserExist.role === ENUM_USER_ROLE.HOUSE_OWNER) {
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
  } else if (isUserExist.role === ENUM_USER_ROLE.HOUSE_RENTER) {
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

  const isBookingExist = await prisma.bookedHouse.findFirst({
    where: {
      id,
    },
    include: {
      user: true,
      house: {
        include: {
          owner: true,
        },
      },
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist.");
  }
  if (!isBookingExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "There is no booking in this id.");
  }

  if (
    isUserExist.role === ENUM_USER_ROLE.ADMIN ||
    isUserExist.role === ENUM_USER_ROLE.SUPER_ADMIN
  ) {
    await prisma.house.update({
      where: {
        id: isBookingExist.houseId,
      },
      data: {
        status: "BOOKED",
      },
    });
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
  }
  if (isUserExist.id === isBookingExist.house.ownerId) {
    await prisma.house.update({
      where: {
        id: isBookingExist.houseId,
      },
      data: {
        status: "BOOKED",
      },
    });
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

  const isBookingExist = await prisma.bookedHouse.findFirst({
    where: {
      id,
    },
    include: {
      user: true,
      house: {
        include: {
          owner: true,
        },
      },
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist.");
  }
  if (!isBookingExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "There is no booking in this id.");
  }

  if (
    isUserExist.role === ENUM_USER_ROLE.ADMIN ||
    isUserExist.role === ENUM_USER_ROLE.SUPER_ADMIN
  ) {
    await prisma.house.update({
      where: {
        id: isBookingExist.houseId,
      },
      data: {
        status: "AVAILABLE",
      },
    });
    return await prisma.bookedHouse.delete({
      where: {
        id,
      },
    });
  }
  if (
    isUserExist.id === isBookingExist.house.ownerId ||
    isUserExist.id === isBookingExist.userId
  ) {
    await prisma.house.update({
      where: {
        id: isBookingExist.houseId,
      },
      data: {
        status: "AVAILABLE",
      },
    });
    return await prisma.bookedHouse.delete({
      where: {
        id,
      },
    });
  }
};

export const BookingService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
