import { Subject } from "rxjs";

export enum FlowEvent {
  SCAN_FILE_REQUESTED = "SCAN_FILE_REQUESTED",
  SCAN_FILE_RESULT_RECEIVED = "SCAN_FILE_RESULT_RECEIVED",
  DEBIT_NOTE_RECEIVED = "DEBIT_NOTE_RECEIVED",
  DEPOSIT_CREATED = "DEPOSIT_CREATED",
}

//TODO: provide the correct types

export type EventPayloadType = {
  [FlowEvent.SCAN_FILE_REQUESTED]: object;
  [FlowEvent.SCAN_FILE_RESULT_RECEIVED]: object;
  [FlowEvent.DEBIT_NOTE_RECEIVED]: object;
  [FlowEvent.DEPOSIT_CREATED]: object;
};

export type EventType<T extends FlowEvent> = {
  type: T;
  userId: string;
  payload: EventPayloadType[T];
};
