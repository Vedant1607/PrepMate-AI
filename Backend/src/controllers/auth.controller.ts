import { userModel } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import {
  type LoginInput,
  type RegisterInput,
} from "../validators/auth.validator.js";
import { tokenBlacklistModel } from "../models/blacklist.model.js";

const generateToken = (userId: string, username: string) => {
  return jwt.sign({ id: userId, username }, env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

/**
 * @name registerUserController
 * @description Register a new user, expects username, email anad password in the request body
 * @access Public
 */
export const registerUserController = async (
  req: Request<{}, {}, RegisterInput>,
  res: Response,
) => {
  try {
    const { username, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserAlreadyExists) {
      return res.status(400).json({
        message: "Account already exists with this username or email address",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id.toString(), user.username);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // change to true in production
      sameSite: "strict",
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

/**
 * @name loginUserController
 * @description Login a user, expects email anad password in the request body
 * @access Public
 */
export const loginUserController = async (
  req: Request<{}, {}, LoginInput>,
  res: Response,
) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id.toString(), user.username);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // change in production
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
export const logoutUserController = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.token;

    if (token) {
      let decoded: { exp: number };
      try {
        decoded = jwt.verify(token, env.JWT_SECRET) as { exp: number };
        console.log("Token decoded successfully, exp:", decoded.exp);
      } catch (err) {
        console.warn("JWT verification failed:", err);
        res.clearCookie("token", {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
        });
        return res
          .status(200)
          .json({ message: "User logged out successfully" });
      }

      try {
        const result = await tokenBlacklistModel.create({
          token,
          expiresAt: new Date(decoded.exp * 1000),
        });
        console.log("Blacklist entry created:", result);
      } catch (dbErr) {
        console.error("DB insert failed:", dbErr);
      }
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @name getMeController
 * @description get the current logged in user details
 * @access private
 */
export const getMeController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const user = await userModel.findById(req.user?.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User details fetched successfully",
      user,
    });
  } catch (err) {
    console.error("GetMe error:", err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
