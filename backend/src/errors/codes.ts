export enum ErrorCode {
  ALLOCATION_EXISTS = "ALLOCATION_EXISTS",
  NO_DEPOSIT = "NO_DEPOSIT",
  NO_ALLOCATION = "NO_ALLOCATION",
  NO_WORKER = "NO_WORKER",
}

export const errorMessages = {
  [ErrorCode.ALLOCATION_EXISTS]: "Allocation already exists",
  [ErrorCode.NO_DEPOSIT]: "No deposit found",
  [ErrorCode.NO_ALLOCATION]: "No allocation found",
  [ErrorCode.NO_WORKER]: "No worker",
};
