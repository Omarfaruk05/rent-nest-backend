import { User } from "@prisma/client";
import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import config from "../../../config";

const insertIntoDB = async (data: User): Promise<User> => {
  data.password = await bcrypt.hash(
    data.password,
    Number(config.bycrypt_salt_rounds)
  );

  const result = await prisma.user.create({
    data,
  });
  return result;
};

export const UserService = {
  insertIntoDB,
};
