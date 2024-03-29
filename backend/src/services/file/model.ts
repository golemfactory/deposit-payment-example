import mongoose from "mongoose";

import { IScanResult, fileStatus } from "./types.js";

const schema = new mongoose.Schema<IScanResult>(
  {
    id: {
      type: String,
      required: true,
      index: { unique: true },
    },
    result: {
      type: String,
      enum: [fileStatus.CLEAN, fileStatus.INFECTED],
      required: true,
    },
  },
  { timestamps: true }
);

export const scanResultModel = mongoose.model<IScanResult>(
  "ScanResult",
  schema
);
