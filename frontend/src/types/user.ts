export enum UserState {
  // User is not connected to the blockchain
  DISCONNECTED = "DISCONNECTED",
  // User is connected to the blockchain, we know their wallet address
  // but they have not registered with the service
  CONNECTED = "CONNECTED",
  LOGGING_IN = "LOGGING_IN",
  // User has registered with the service but not yet allowance given
  REGISTERED = "REGISTERED",
  // User has given GLM allowance above a certain threshold
  GRANTED = "GRANTED",
  // User has to give GLM allowance
  NOT_GRANTED = "NOT_GRANTED",
  // User is in the process of connecting
  LOADING = "LOADING",
  // User has deposited GLM
  HAS_DEPOSIT = "HAS_DEPOSIT",
  // User has not deposited GLM
  HAS_NO_DEPOSIT = "HAS_NO_DEPOSIT",
  // User has allocatio
  HAS_ALLOCATION = "HAS_ALLOCATION",
  // User has no allocation
  HAS_NO_ALLOCATION = "HAS_NO_ALLOCATION",
}

export enum UserAction {
  CONNECT = "CONNECT",
  DISCONNECT = "DISCONNECT",
  REGISTER = "REGISTER",
  LOGIN = "LOGIN",
  APPROVE = "APPROVE",
  LOADING = "LOADING",
  ENOUGH_ALLOWANCE = "ENOUGH_ALLOWANCE",
  NOT_ENOUGH_ALLOWANCE = "NOT_ENOUGH_ALLOWANCE",
  HAS_DEPOSIT = "HAS_DEPOSIT",
  HAS_NO_DEPOSIT = "HAS_NO_DEPOSIT",
  HAS_ALLOCATION = "HAS_ALLOCATION",
  HAS_NO_ALLOCATION = "HAS_NO_ALLOCATION",
}

export const UserStateOrderValue = {
  [UserState.DISCONNECTED]: 0,
  [UserState.CONNECTED]: 1,
  [UserState.LOGGING_IN]: 2,
  [UserState.REGISTERED]: 3,
  [UserState.GRANTED]: 5,
  [UserState.NOT_GRANTED]: 5,
  [UserState.LOADING]: 4,
  [UserState.HAS_DEPOSIT]: 6,
  [UserState.HAS_NO_DEPOSIT]: 6,
  [UserState.HAS_ALLOCATION]: 7,
  [UserState.HAS_NO_ALLOCATION]: 7,
};

export type Deposit = {
  isCurrent: boolean;
  id: string;
  isValid: boolean;
  nonce: number;
};

export type UserData = {
  _id: string;
  nonce: number;
  currentAllocation: {
    id: string;
  };
  currentActivity: {
    id: string;
  };
  deposits: {
    isCurrent: boolean;
    isValid: boolean;
    nonce: number;
  }[];
};
