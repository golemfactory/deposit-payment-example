import { DeleteResult } from "mongodb";

type UserIdType = string;
//Todo use branded tyope end ensure that the address is a valid ethereum address
type EthereumAddressType = `0x${string}`;
type NonceType = number;

export interface IUser {
  id: UserIdType;
  nonce: NonceType;
  walletAddress: EthereumAddressType;
}

export interface IUserService {
  registerUser(walletAddress: string): Promise<IUser>;
  regenerateNonce(userId: UserIdType): Promise<NonceType>;
  findByWalletAddress(
    walletAddress: EthereumAddressType
  ): Promise<IUser | null>;
  findById(userId: UserIdType): Promise<IUser | null>;
  deleteUser(userId: UserIdType): Promise<DeleteResult>;
}
