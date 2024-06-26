import { IUserService, Deposit, DepositData } from "./types.js";
import { userModel } from "./model.js";
import { container } from "../../di.js";

const randomNonce = () => {
  return Math.floor(Math.random() * 10000000000);
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
    return userModel.findOne({ _id: userId });
  },
  //@ts-ignore
  getCurrentDeposit: async (userId: string): DepositData | null => {
    const user = await userModel.findOne({ _id: userId });
    if (!user) {
      throw new Error(`User not found with id ${userId}`);
    }
    const deposit = user?.deposits.find((d) => d.isCurrent);
    console.log("deposit", deposit);
    if (!deposit) {
      return null;
    }
    //@ts-ignore
    return container.cradle.paymentService.getDeposit(deposit.id);
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

  getUserById: async (userId: string) => {
    return userModel.findOne({ _id: userId });
  },

  setCurrentAllocationId: async (userId: string, allocationId: string) => {
    await userModel.updateOne(
      { _id: userId },
      { currentAllocationId: allocationId }
    );
  },

  onAgreementTerminated: async (agreementId: string) => {
    await userModel.updateMany(
      { currentAgreementId: agreementId },
      { currentAgreementId: null }
    );
  },

  async getUserDTO(userId: string) {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error(`User not found with id ${userId}`);
    }
    return {
      walletAddress: user.walletAddress,
      _id: user._id.toString(),
      nonce: user.nonce.toString(),
      currentAllocation: {
        id: user.currentAllocationId,
      },
      currentAgreement: {
        id: user.currentAgreementId,
      },
      deposits: user.deposits.map((d) => {
        return {
          isCurrent: d.isCurrent,
          isValid: d.isValid,
          nonce: d.nonce.toString(),
          id: d.id,
        };
      }),
    };
  },
  setCurrentAgreementId: async (userId: string, agreementId: string) => {
    console.log("Setting agreement id", agreementId, userId);
    await userModel.updateOne(
      { _id: userId },
      { currentAgreementId: agreementId }
    );
  },

  terminateCurrentAgreement: async (userId: string) => {
    await userModel.updateOne({ _id: userId }, { currentAgreementId: null });
  },

  invalidateCurrentDeposit: async (userId: string) => {
    await userModel
      .updateOne(
        { _id: userId },
        {
          $set: {
            "deposits.$[elem].isValid": false,
          },
        },
        {
          arrayFilters: [{ "elem.isCurrent": true }],
        }
      )
      .exec();
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

    await userModel.updateOne(
      { _id: userId },
      {
        $push: {
          deposits: {
            nonce: Number(deposit.nonce),
            isCurrent: deposit.isCurrent,
            isValid: deposit.isValid,
            id: deposit.id,
          },
        },
      }
    );
  },
  ...userModel,
};
