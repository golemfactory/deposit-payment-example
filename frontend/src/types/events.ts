import { EventWithPayload } from "types/reducerArgs";

export enum Event {
  DEPOSIT_CREATED = "DEPOSIT_CREATED",
  ALLOCATION_CREATED = "ALLOCATION_CREATED",
  AGREEMENT_SIGNED = "AGREEMENT_SIGNED",
  FILE_SCAN_OK = "FILE_SCAN_OK",
  FILE_SCAN_ERROR = "FILE_SCAN_ERROR",
  NEW_INVOICE = "NEW_INVOICE",
  AGREEMENT_TERMINATED = "AGREEMENT_TERMINATED",
  ALLOCATION_RELEASED = "ALLOCATION_RELEASED",
  DEPOSIT_RELEASED = "DEPOSIT_RELEASED",
  DEPOSIT_EXTENDED = "DEPOSIT_EXTENDED",
  NEW_DEBIT_NOTE = "NEW_DEBIT_NOTE",
  DEPOSIT_PROVIDER_PAYMENT = "DEPOSIT_PAYMENT",
  DEPOSIT_FEE_PAYMENT = "DEPOSIT_FEE_PAYMENT",
}

export type Payload = {
  [Event.DEPOSIT_CREATED]: {
    txHash: `0x${string}`;
    amount: number;
    fee: number;
    validityTimestamp: number;
  };

  [Event.DEPOSIT_RELEASED]: {
    agreementId: string;
  };

  [Event.DEPOSIT_EXTENDED]: {
    txHash: `0x${string}`;
    amount: number;
    fee: number;
    validityTimestamp: number;
  };

  [Event.ALLOCATION_CREATED]: {
    allocationId: string;
    amount: number;
    validityTimestamp: number;
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

  [Event.AGREEMENT_SIGNED]: {
    agreementId: string;
    offer: {
      providerId: `0x${string}`;
    };
  };

  [Event.AGREEMENT_TERMINATED]: {
    agreementId: string;
  };

  [Event.ALLOCATION_RELEASED]: {
    allocationId: string;
  };

  [Event.DEPOSIT_FEE_PAYMENT]: {
    depositId: string;
    amount: number;
    txHash: `0x${string}`;
  };

  [Event.DEPOSIT_PROVIDER_PAYMENT]: {
    depositId: string;
    amount: number;
    txHash: `0x${string}`;
  };

  [Event.NEW_DEBIT_NOTE]: {};
};

export type EventType = EventWithPayload<Payload>;

export type ExtractPayload<K extends Event> = K extends keyof Payload
  ? Payload[K]
  : never;
