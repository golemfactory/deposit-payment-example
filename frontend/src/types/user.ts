export enum UserState {
  // User is not connected to the blockchain
  DISCONNECTED = "DISCONNECTED",
  // User is connected to the blockchain, we know their wallet address
  // but they have not registered with the service
  CONNECTED = "CONNECTED",
  // User has registered with the service but not yet allowance given
  REGISTERED = "REGISTERED",
  // User has given GLM allowance
  GRANTED = "GRANTED",
}

export enum UserAction {
  CONNECT = "CONNECT",
  DISCONNECT = "DISCONNECT",
  REGISTER = "REGISTER",
  APPROVE = "APPROVE",
}
