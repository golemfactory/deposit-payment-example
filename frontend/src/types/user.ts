export enum UserState {
  // User is not connected to the blockchain
  DISCONNECTED = "DISCONNECTED",
  // User is connected to the blockchain, we know their wallet address
  // but they have not registered with the service
  CONNECTED = "CONNECTED",
  // User has registered with the service but not yet allowance given
  REGISTERED = "REGISTERED",
  // User has given GLM allowance above a certain threshold
  GRANTED = "GRANTED",
  // User has to give GLM allowance
  NOT_GRANTED = "NOT_GRANTED",
  // User is in the process of connecting
  LOADING = "LOADING",
}

export enum UserAction {
  CONNECT = "CONNECT",
  DISCONNECT = "DISCONNECT",
  REGISTER = "REGISTER",
  APPROVE = "APPROVE",
  LOADING = "LOADING",
  ENOUGH_ALLOWANCE = "ENOUGH_ALLOWANCE",
  NOT_ENOUGH_ALLOWANCE = "NOT_ENOUGH_ALLOWANCE",
}
