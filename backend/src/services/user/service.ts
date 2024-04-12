import { IUserService, IUser, Deposit, DepositData } from "./types.js";
import { userModel } from "./model.js";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import { container } from "../../di.js";
const randomNonce = () => {
  return Math.floor(Math.random() * 10000000);
};

export const userService: IUserService = {
  registerUser: async (walletAddress: string) => {
    const user = await userModel.findOne({ walletAddress });

    if (user !== null) {
      return user;
    }
    return await new userModel(
      {
        walletAddress,
        nonce: randomNonce(),
        deposits: [],
      },
      {
        _id: true,
      }
    ).save();
  },
  //@ts-ignore
  findById: async (userId: string) => {
    console.log("find by id", userId);
    return userModel.findOne({ _id: userId });
  },
  //@ts-ignore
  getCurrentDeposit: async (userId: string): DepositData | null => {
    const user = await userModel.findOne({ _id: userId });
    if (!user) {
      throw new Error(`User not found with id ${userId}`);
    }
    const deposit = user?.deposits.find((d) => d.isCurrent);
    if (!deposit) {
      return null;
    }
    const nonce = deposit?.nonce;
    return container.cradle.paymentService.getDeposit(
      nonce,
      user?.walletAddress
    );
  },
  regenerateNonce: async (userId: string) => {
    const nonce = randomNonce();
    await userModel.findOneAndUpdate({ id: userId }, { nonce });
    return nonce;
  },
  findByWalletAddress: async (walletAddress: string) => {
    return userModel.findOne({ walletAddress });
  },
  deleteUser: async (userId: string) => {
    return userModel.deleteOne({ id: userId });
  },

  setCurrentAllocationId: async (userId: string, allocationId: string) => {
    console.log("setting allocation id", userId, allocationId);
    await userModel.updateOne(
      { _id: userId },
      { currentAllocationId: allocationId }
    );
  },

  addDeposit: async (userId: string, deposit: Deposit) => {
    await userModel.updateOne(
      { _id: userId },
      {
        $set: {
          "deposits.$[].isCurrent": false,
        },
      }
    );
    const user = await userModel.findOne({ _id: userId });
    const up = await userModel.updateOne(
      { _id: userId },
      {
        $push: {
          deposits: deposit,
        },
      }
    );
  },
  ...userModel,
};
