import mongoose, { Schema } from "mongoose";

const blacklistTokenSchema = new Schema(
  {
    token: {
      type: String,
      required: [true, "Token is required to be added in blacklist"],
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  {
    timestamps: true,
  },
);

export const tokenBlacklistModel = mongoose.model("blacklistTokens", blacklistTokenSchema);