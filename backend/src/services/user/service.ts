import { IUserService, IUser } from "./types.js";
import { userModel } from "./model.js";
import { v4 as uuidv4 } from "uuid";

const randomNonce = () => {
  return Math.floor(Math.random() * 10000000);
};

export const userService: IUserService = {
  registerUser: async (walletAddress: string) => {
    const user = await userModel.findOne({ walletAddress });
    if (user !== null) {
      return user;
    }
    return new userModel(
      {
        walletAddress,
        nonce: randomNonce(),
        id: uuidv4(),
      },
      {
        _id: true,
      }
    ).save();
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

  addDeposit: async ({
    userId,
    isValid,
    id,
  }: {
    userId: string;
    isValid: boolean;
    id: string;
  }) => {
    userModel.updateOne(
      { id: userId },
      {
        $set: {
          "deposits.$[].isCurrent": false,
        },
      }
    );
    userModel.updateOne(
      { id: userId },
      {
        $push: {
          deposits: {
            isCurrent: true,
            id,
            isValid,
          },
        },
      }
    );
  },
  ...userModel,
};
