import { t } from "i18next";
import { DeleteResult } from "mongodb";

type UserIdType = string;
//Todo use branded tyope end ensure that the address is a valid ethereum address
type EthereumAddressType = `0x${string}`;
type NonceType = number;

export type Deposit = {
  isCurrent: boolean;
  isValid: boolean;
  nonce: bigint;
};

export interface IUser {
  _id: UserIdType;
  nonce: NonceType;
  walletAddress: EthereumAddressType;
  deposits: Deposit[];
}

export interface IUserService {
  registerUser(walletAddress: string): Promise<IUser>;
  regenerateNonce(userId: UserIdType): Promise<NonceType>;
  findByWalletAddress(
    walletAddress: EthereumAddressType
  ): Promise<IUser | null>;
  findById(userId: UserIdType): Promise<IUser | null>;
  deleteUser(userId: UserIdType): Promise<DeleteResult>;
  addDeposit(userId: string, deposit: Deposit): Promise<void>;
}
