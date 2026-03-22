import { Router } from "express";
import {
  loginUserController,
  registerUserController,
} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";

export const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post("/register", validate(registerSchema), registerUserController);

/**
 * @route POST /api/auth/login
 * @description Login user with email and password
 * @access Public
 */

authRouter.post("/login", validate(loginSchema), loginUserController);
