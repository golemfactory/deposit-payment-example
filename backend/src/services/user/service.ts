import mongoose from "mongoose";
import { IUser, IUserService } from "./types";

const randomNonce = () => {
  return Math.floor(Math.random() * 10000000);
};

export const UserService = (model: mongoose.Model<IUser>): IUserService => {
  return {
    ...model,
    registerUser: async (walletAddress: string) => {
      const user = model.findOne({ walletAddress });
      if (user !== null) {
        throw new Error("User already exists");
      }
      return model.create({ walletAddress, nonce: randomNonce() });
    },
    regenerateNonce: async (userId: string) => {
      const nonce = randomNonce();
      await model.findOneAndUpdate({ id: userId }, { nonce });
      return nonce;
    },
    findByWalletAddress: async (walletAddress: string) => {
      return model.findOne({ walletAddress });
    },
    deleteUser: async (userId: string) => {
      return model.deleteOne({ id: userId });
    },
  };
};
