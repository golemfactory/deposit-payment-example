import { IUserService, IUser, Deposit } from "./types.js";
import { userModel } from "./model.js";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

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
