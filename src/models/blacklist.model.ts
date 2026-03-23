import mongoose, { Schema } from "mongoose";

const blacklistTokenSchema = new Schema(
  {
    token: {
      type: String,
      required: [true, "Token is required to be added in blacklist"],
    },
  },
  {
    timestamps: true,
  },
);

export const tokenBlacklistModel = mongoose.model("blacklistTokens", blacklistTokenSchema);