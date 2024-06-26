import awilix, { InjectionMode } from "awilix";
import { userService } from "./services/user/index.js";
import mongoose from "mongoose";
import { paymentService } from "./services/payment/index.js";
import { fileService } from "./services/file/service.js";
import * as GolemSDK from "@golem-sdk/task-executor";
import { Yagna } from "./services/yagna/service.js";

export const container = awilix.createContainer<{
  db: Promise<typeof mongoose>;
  userService: typeof userService;
  paymentService: ReturnType<typeof paymentService>;
  fileService: ReturnType<typeof fileService>;
  GolemSDK: typeof GolemSDK;
  YagnaConfig: {
    appKey: string;
    apiUrl: string;
    subnetTag: string;
  };
  connectionString: string;
  contractAddress: string;
  serviceFee: string;
  mode: "mock" | "real";
  Yagna: Yagna;
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
  YagnaConfig: awilix.asValue({
    appKey: process.env.YAGNA_APPKEY || "",
    apiUrl: process.env.YAGNA_API_URL || "",
    subnetTag: process.env.YAGNA_SUBNET || "",
  }),
});

container.register({
  mode: awilix.asValue("real"),
});

container.register({
  db: awilix
    .asFunction((connectionString) => {
      return mongoose.connect(connectionString, {
        dbName: process.env.DB_NAME,
      });
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

container.register({
  Yagna: awilix.asClass(Yagna).singleton(),
});

container.cradle.db.then(() => {
  console.log("Connected to database");
});

container.cradle.fileService.init();

container.cradle.Yagna.observeEvents();
