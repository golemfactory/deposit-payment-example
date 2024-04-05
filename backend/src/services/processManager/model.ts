import mongoose from "mongoose";
import { FlowEvent, EventType } from "./types.js";

const schema = new mongoose.Schema<EventType<FlowEvent>>(
  {
    type: { type: String, required: true },
    userId: { type: String, required: true },
    payload: { type: Object, required: true },
  },
  { timestamps: true }
);

export const eventModel = mongoose.model<EventType<FlowEvent>>("Event", schema);
