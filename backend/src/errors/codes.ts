export enum ErrorCode {
  ALLOCATION_EXISTS = "ALLOCATION_EXISTS",
  NO_DEPOSIT = "NO_DEPOSIT",
  NO_ALLOCATION = "NO_ALLOCATION",
  NO_WORKER = "NO_WORKER",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  ALLOCATION_NOT_FOUND = "ALLOCATION_NOT_FOUND",
  AGREEMENT_NOT_FOUND = "AGREEMENT_NOT_FOUND",
  ALLOCATION_TOP_UP_FAILED = "ALLOCATION_TOP_UP_FAILED",
}

export const errorMessages = {
  [ErrorCode.ALLOCATION_EXISTS]: () => "Allocation already exists",
  [ErrorCode.NO_DEPOSIT]: () => "No deposit found",
  [ErrorCode.NO_ALLOCATION]: () => "No allocation found",
  [ErrorCode.NO_WORKER]: () => "No worker",
  [ErrorCode.USER_NOT_FOUND]: () => "User not found",
  [ErrorCode.AGREEMENT_NOT_FOUND]: () => "Agreement not found",
  [ErrorCode.ALLOCATION_NOT_FOUND]: ({
    allocationId,
  }: {
    allocationId: string;
  }) => `Allocation not found: ${allocationId}`,
  [ErrorCode.ALLOCATION_TOP_UP_FAILED]: ({
    allocationId,
  }: {
    allocationId: string;
  }) => `Allocation top up failed: ${allocationId}`,
};

export type ErrorParams = {
  [ErrorCode.ALLOCATION_EXISTS]: never;
  [ErrorCode.NO_DEPOSIT]: never;
  [ErrorCode.NO_ALLOCATION]: never;
  [ErrorCode.NO_WORKER]: never;
  [ErrorCode.USER_NOT_FOUND]: never;
  [ErrorCode.ALLOCATION_NOT_FOUND]: {
    allocationId: string;
  };
  [ErrorCode.ALLOCATION_TOP_UP_FAILED]: {
    allocationId: string;
  };
  [ErrorCode.AGREEMENT_NOT_FOUND]: {
    agreementId: string;
  };
};

type ErrorArgs<T> = {
  [K in keyof T]: T[K] extends never
    ? { code: K; payload?: never }
    : { code: K; payload: T[K] };
}[keyof T];

export type ErrorPayload = ErrorArgs<ErrorParams>;
