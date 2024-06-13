import { DeleteResult } from "mongodb";

type UserIdType = string;
//Todo use branded tyope end ensure that the address is a valid ethereum address
type EthereumAddressType = `0x${string}`;
type NonceType = number;

export type Deposit = {
  isCurrent: boolean;
  isValid?: boolean;
  nonce: bigint;
  id: string;
};

export type DepositData = {
  amount: bigint;
  feeAmount: bigint;
  spender: string;
  validTo: bigint;
  id: bigint;
};

export interface IUser {
  _id: UserIdType;
  nonce: NonceType;
  walletAddress: EthereumAddressType;
  deposits: Deposit[];
  currentAllocationId: string;
  currentAllocationAmount: number;
  currentAgreementId: string;
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
  getCurrentDeposit(userId: UserIdType): Promise<DepositData | null>;
  setCurrentAllocationId(
    userId: UserIdType,
    allocationId: string
  ): Promise<void>;
  setCurrentAllocationAmount(
    userId: UserIdType,
    amount: number
  ): Promise<boolean>;
  getUserById(userId: UserIdType): Promise<IUser | null>;
  setCurrentAgreementId(userId: UserIdType, agreementId: string): Promise<void>;
  getUserDTO(userId: UserIdType): Promise<any>;
  onAgreementTerminated(agreementId: UserIdType): Promise<void>;
}
