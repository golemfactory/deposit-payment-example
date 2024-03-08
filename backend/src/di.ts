import awilix, { InjectionMode } from "awilix";
import { userService } from "./services/user/index.js";
import mongoose from "mongoose";
import { paymentService } from "./services/payment/index.js";
export const container = awilix.createContainer({
  injectionMode: InjectionMode.CLASSIC,
  strict: true,
});

container.register({
  connectionString: awilix.asValue(process.env.MONGO_URI),
});

container.register({
  contractAddress: awilix.asValue(process.env.DEPOSIT_CONTRACT_ADDRESS),
});

container.register({
  serviceFee: awilix.asValue(process.env.SERVICE_FEE),
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

container.cradle.db.then(() => {
  console.log("Connected to database");
});
