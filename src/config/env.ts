import dotenv from "dotenv";
import { safeParse, z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().optional(),
  MONGO_URI: z.string().min(1, "Mongo URI is required."),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  JWT_EXPIRES_IN: z.string().default("7d"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(`Invalid env variables: ${parsedEnv.error}`);
  process.exit(1);
}

export const env = {
  PORT: parsedEnv.data.PORT ? Number(parsedEnv.data.PORT) : 3000,
  MONGO_URI: parsedEnv.data.MONGO_URI,
  JWT_SECRET: parsedEnv.data.JWT_SECRET,
  JWT_EXPIRES_IN: parsedEnv.data.JWT_EXPIRES_IN,
};
