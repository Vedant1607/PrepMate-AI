import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { tokenBlacklistModel } from "../models/blacklist.model.js";
import { env } from "../config/env.js";

export const authUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      message: "Token not provided",
    });
  }

  try {
    const isBlacklisted = await tokenBlacklistModel.findOne({ token });

    if (isBlacklisted) {
      return res.status(401).json({
        message: "Token expired",
      });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
      username: string;
    };

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};
