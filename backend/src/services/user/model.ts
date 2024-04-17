import mongoose from "mongoose";

import { IUser } from "./types.js";

const schema = new mongoose.Schema<IUser>(
  {
    nonce: {
      type: Number,
      required: true,
    },
    walletAddress: {
      type: String,
      required: true,
      index: { unique: true },
    },
    currentAllocationId: {
      type: String,
    },
    deposits: [
      {
        isCurrent: {
          type: Boolean,
          required: true,
        },
        nonce: {
          type: Number,
          required: true,
        },
        isValid: {
          type: Boolean,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export const userModel = mongoose.model<IUser>("User", schema);
