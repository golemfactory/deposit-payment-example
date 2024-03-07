import mongoose from "mongoose";

import { IUser } from "./types";

const schema = new mongoose.Schema<IUser>(
  {
    id: {
      type: String,
      required: true,
      index: { unique: true },
    },
    nonce: {
      type: Number,
      required: true,
    },
    walletAddress: {
      type: String,
      required: true,
      index: { unique: true },
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUser>("User", schema);
