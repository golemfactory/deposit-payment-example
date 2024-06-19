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

export const EventTitle: { [key in Event]: string } = {
  [Event.DEPOSIT_CREATED]: "Deposit Created",
  [Event.ALLOCATION_CREATED]: "Allocation Created",
  [Event.AGREEMENT_SIGNED]: "Agreement Signed",
  [Event.FILE_SCAN_OK]: "File Scan: Clean",
  [Event.FILE_SCAN_ERROR]: "File Scan: Virus ",
  [Event.NEW_INVOICE]: "New Invoice",
  [Event.AGREEMENT_TERMINATED]: "Agreement Terminated",
  [Event.ALLOCATION_RELEASED]: "Allocation Released",
  [Event.DEPOSIT_RELEASED]: "Deposit Released",
  [Event.DEPOSIT_EXTENDED]: "Deposit Extended",
  [Event.NEW_DEBIT_NOTE]: "New Debit Note",
  [Event.DEPOSIT_PROVIDER_PAYMENT]: "Provider Payment",
  [Event.DEPOSIT_FEE_PAYMENT]: "Service Owner Payment",
};

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
    id: string;
  };

  [Event.FILE_SCAN_ERROR]: {
    id: string;
    data: {
      Viruses: string[];
    };
  };

  [Event.NEW_INVOICE]: {
    agreementId: string;
    invoiceId: string;
    transactionId?: string;
    amount: string;
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

  [Event.NEW_DEBIT_NOTE]: {
    agreementId: string;
    debitNoteId: string;
    totalAmountDue: string;
    paymentDueDate: string;
  };
};

export type EventType = EventWithPayload<Payload>;

export type ExtractPayload<K extends Event> = K extends keyof Payload
  ? Payload[K]
  : never;
