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
    deposits: [
      {
        id: {
          type: BigInt,
          required: true,
        },
        spender: {
          type: String,
          required: true,
        },
        amount: {
          type: BigInt,
          required: true,
        },
        feeAmount: {
          type: BigInt,
          required: true,
        },
        isCurrent: {
          type: Boolean,
          required: true,
        },
        nonce: {
          type: BigInt,
          required: true,
        },
        isValid: {
          type: Boolean,
          required: true,
        },
        validTo: {
          type: BigInt,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export const userModel = mongoose.model<IUser>("User", schema);
