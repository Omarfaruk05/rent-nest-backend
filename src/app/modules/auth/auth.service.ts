import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";

import { ILoginUser, ILoginUserResponse } from "../user/user.interface";
import config from "../../../config";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { Secret } from "jsonwebtoken";
import { IRefreshTokenResponse } from "./auth.interface";

const loginUser = async (
  loginData: ILoginUser
): Promise<ILoginUserResponse> => {
  const { email, password } = loginData;

  const isUserExist = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist.");
  }

  const isPasswordMatched = await bcrypt.compare(
    password,
    isUserExist.password
  );

  if (isUserExist.password && !isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password is incorrect.");
  }

  // generating access token
  const accessToken = jwtHelpers.createToken(
    { id: isUserExist?.id, email: isUserExist?.email, role: isUserExist?.role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  // generating refresh token
  const refreshToken = jwtHelpers.createToken(
    { email: isUserExist?.email, role: isUserExist.role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null;

  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalide Refresh Token");
  }
  //checking deleted user's refresh token
  const { email, role } = verifiedToken;

  let newAccessToken = "";

  if (role === "House Renter" || role === "House Owner") {
    const isUserExist = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!isUserExist) {
      throw new ApiError(httpStatus.NOT_FOUND, "User does not exist.");
    }

    //generate new access token
    newAccessToken = jwtHelpers.createToken(
      { email: isUserExist.email, role: isUserExist.role },
      config.jwt.secret as Secret,
      config.jwt.expires_in as string
    );
  }

  return {
    accessToken: newAccessToken,
  };
};

export const AuthService = {
  loginUser,
  refreshToken,
};
