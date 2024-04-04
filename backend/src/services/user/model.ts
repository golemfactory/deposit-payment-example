import mongoose from "mongoose";

import { IUser } from "./types.js";

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
    deposits: [
      {
        amount: {
          type: Number,
          required: true,
        },
        feeAmount: {
          type: Number,
          required: true,
        },
        isCurrent: {
          type: Boolean,
          required: true,
        },
        id: {
          type: String,
          required: true,
          index: { unique: true },
        },
      },
    ],
  },
  { timestamps: true }
);

export const userModel = mongoose.model<IUser>("User", schema);
