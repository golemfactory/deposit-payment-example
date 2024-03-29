import awilix, { InjectionMode } from "awilix";
import { userService } from "./services/user/index.js";
import mongoose from "mongoose";
import { paymentService } from "./services/payment/index.js";
import { fileService } from "./services/file/service.js";
import * as GolemSDK from "@golem-sdk/golem-js";

export const container = awilix.createContainer<{
  db: Promise<typeof mongoose>;
  userService: typeof userService;
  paymentService: ReturnType<typeof paymentService>;
  fileService: ReturnType<typeof fileService>;
  GolemSDK: typeof GolemSDK;
  connectionString: string;
  contractAddress: string;
  serviceFee: string;
  mode: "mock" | "real";
}>({
  injectionMode: InjectionMode.CLASSIC,
  strict: true,
});

container.register({
  GolemSDK: awilix.asValue(GolemSDK),
});

container.register({
  connectionString: awilix.asValue(process.env.MONGO_URI || ""),
});

container.register({
  contractAddress: awilix.asValue(process.env.DEPOSIT_CONTRACT_ADDRESS || ""),
});

container.register({
  serviceFee: awilix.asValue(process.env.SERVICE_FEE || ""),
});

container.register({
  mode: awilix.asValue("mock"),
});

container.register({
  db: awilix
    .asFunction((connectionString) => {
      console.log("connection string", connectionString);
      return mongoose.connect(connectionString);
    })
    .singleton(),
});

container.register({
  userService: awilix.asValue(userService),
});

container.register({
  paymentService: awilix.asFunction(paymentService),
});

container.register({
  fileService: awilix.asFunction(fileService).singleton(),
});

container.cradle.db.then(() => {
  console.log("Connected to database");
});
