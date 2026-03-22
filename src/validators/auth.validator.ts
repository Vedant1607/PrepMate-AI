import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(4, "Username must be atleast 4 characters long"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be atleast 6 characters long"),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

// Type Inference
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
