import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
}

const userSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      unique: [true, "username already taken"],
      required: true,
      trim: true,
    },

    email: {
      type: String,
      unique: [true, "Account already exists with this email address"],
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const userModel = mongoose.model<IUser>("User", userSchema);
