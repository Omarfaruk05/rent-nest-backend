import { BookedHouse, Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelpers";

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

  if (role === "HOUSE_RENTER") {
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
  if (role === "HOUSE_OWNER") {
    andConditions.push({
      AND: [
        {
          house: {
            owner: {
              id: userId,
            },
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

export const BookingService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
