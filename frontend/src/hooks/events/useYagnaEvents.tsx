import { io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { useLocalStorage } from "hooks/useLocalStorage";
import { merge } from "rxjs";
import { Event } from "types/events";
import { match } from "ts-pattern";
import { useEvents } from "./useEvents";

enum yagnaEventTopic {
  debitNote = "debitNote",
  invoice = "invoice",
  agreement = "agreement",
}

enum yagnaEventType {
  AgreementTerminatedEvent = "AgreementTerminatedEvent",
  AgreementApprovedEvent = "AgreementApprovedEvent",
  InvoiceReceivedEvent = "InvoiceReceivedEvent",
  DebitNoteReceivedEvent = "DebitNoteReceivedEvent",
}

const yagnaEventTypeByTopic = {
  debitNote: [yagnaEventType.DebitNoteReceivedEvent],
  invoice: [yagnaEventType.InvoiceReceivedEvent],
  agreement: [
    yagnaEventType.AgreementApprovedEvent,
    yagnaEventType.AgreementTerminatedEvent,
  ],
};

//As ya-ts-client doet not provide the event type, we need to create a mapper

const isInTopic = (topic: yagnaEventTopic) => (eventType: yagnaEventType) => {
  return yagnaEventTypeByTopic[topic].includes(eventType);
};

export const getEventKind = (yagnaEventType: string): Event => {
  return match(yagnaEventType)
    .with("AgreementTerminatedEvent", () => Event.AGREEMENT_TERMINATED)
    .with("AgreementApprovedEvent", () => Event.AGREEMENT_SIGNED)
    .with("InvoiceReceivedEvent", () => Event.NEW_INVOICE)
    .with("DebitNoteReceivedEvent", () => Event.NEW_DEBIT_NOTE)
    .otherwise(() => {
      throw new Error(`Unknown event type: ${yagnaEventType}`);
    });
};

const socketFactory = (eventEndpoint: yagnaEventTopic) =>
  io(`${import.meta.env.VITE_BACKEND_WS_URL}/${eventEndpoint}Events`, {
    autoConnect: false,
  });

export const useYagnaEvent = (event: yagnaEventTopic) => {
  const [accessToken] = useLocalStorage("accessToken");
  const socketRef = useRef(socketFactory(event));
  const { events$, emit, clean } = useEvents({
    key: `yagna${event[0].toUpperCase()}${event.substring(1)}Events`,
    eventKind: getEventKind,
  });

  useEffect(() => {
    if (accessToken) {
      socketRef.current.auth = { token: accessToken };
      socketRef.current.connect();

      socketRef.current.on("event", (data: any) => {
        if (!isInTopic(event)(data.event.eventType)) return;
        emit({ id: data.id, ...data[event] }, data.event.eventType);
      });
    }
  }, [accessToken]);

  return {
    events$,
    clean,
  };
};

export const useDebitNoteEvents = () => {
  const { events$ } = useYagnaEvent(yagnaEventTopic.debitNote);
  return { events$ };
};

export const useYagnaEvents = () => {
  const { events$: debitNoteEvents$, clean: cleanDebitNoteEvents } =
    useYagnaEvent(yagnaEventTopic.debitNote);

  const { events$: invoiceEvents$, clean: cleanInvoiceEvents } = useYagnaEvent(
    yagnaEventTopic.invoice
  );
  const { events$: agreementEvents$, clean: cleanAgreementEvents } =
    useYagnaEvent(yagnaEventTopic.agreement);

  return {
    events$: merge(debitNoteEvents$, invoiceEvents$, agreementEvents$),
    clean: () => {
      cleanDebitNoteEvents();
      cleanInvoiceEvents();
      cleanAgreementEvents();
    },
  };
};
