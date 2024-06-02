import { EventWithPayload } from "types/reducerArgs";

export enum Event {
  DEPOSIT_CREATED = "DEPOSIT_CREATED",
  ALLOCATION_CREATED = "ALLOCATION_CREATED",
  AGREEMENT_SIGNED = "AGREEMENT_SIGNED",
  FILE_SCAN_OK = "FILE_SCAN_OK",
  FILE_SCAN_ERROR = "FILE_SCAN_ERROR",
  NEW_INVOICE = "NEW_INVOICE",
  AGREEMENT_TERMINATED = "AGREEMENT_TERMINATED",
  PROVIDER_PAID = "PROVIDER_PAID",
  ALLOCATION_RELEASED = "ALLOCATION_RELEASED",
  PAYMENT_FOR_GAS = "PAYMENT_FOR_GAS",
  DEPOSIT_RELEASED = "DEPOSIT_RELEASED",
}

export type Payload = {
  [Event.DEPOSIT_CREATED]: {
    transactionHash: string;
    amount: number;
    fee: number;
    validityTimestamp: number;
  };
  [Event.ALLOCATION_CREATED]: {
    allocationId: string;
    amount: number;
    validityTimestamp: number;
  };
  [Event.AGREEMENT_SIGNED]: {
    providerId: string;
    agreementId: string;
  };
  [Event.FILE_SCAN_OK]: {
    fileId: string;
  };
  [Event.FILE_SCAN_ERROR]: {
    fileId: string;
  };
  [Event.NEW_INVOICE]: {
    agreementId: string;
    invoiceId: string;
    transactionId?: string;
  };
  [Event.AGREEMENT_TERMINATED]: {
    agreementId: string;
  };
  [Event.PROVIDER_PAID]: {
    agreementId: string;
  };
  [Event.ALLOCATION_RELEASED]: {
    agreementId: string;
  };
  [Event.PAYMENT_FOR_GAS]: {
    agreementId: string;
  };
  [Event.DEPOSIT_RELEASED]: {
    agreementId: string;
  };
};

export type EventType = EventWithPayload<Payload>;
