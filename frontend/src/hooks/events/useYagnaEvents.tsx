import useSWRSubscription from "swr/subscription";
import { io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { useLocalStorage } from "hooks/useLocalStorage";
import { Subject, merge } from "rxjs";
import { string } from "ts-pattern/dist/patterns";
import { Event } from "types/events";
import { match } from "ts-pattern";
import { useEvents } from "./useEvents";

enum yagnaEventTopic {
  debitNote = "debitNote",
  invoice = "invoice",
  agreement = "agreement",
}

//As ya-ts-client doet not provide the event type, we need to create a mapper

export const getEventKind = (yagnaEventType: string): Event => {
  console.log("yagnaEventType", yagnaEventType);
  return match(yagnaEventType)
    .with("AgreementTerminatedEvent", () => Event.AGREEMENT_TERMINATED)
    .with("AgreementApprovedEvent", () => Event.AGREEMENT_SIGNED)
    .with("InvoiceCreatedEvent", () => Event.NEW_INVOICE)
    .otherwise(() => {
      throw new Error(`Unknown event type: ${yagnaEventType}`);
    });
};

const socketFactory = (eventEndpoint: yagnaEventTopic) =>
  io(`http://localhost:5174/${eventEndpoint}Events`, {
    autoConnect: false,
  });

export const useYagnaEvent = (event: yagnaEventTopic) => {
  const [accessToken] = useLocalStorage("accessToken");

  const socketRef = useRef(socketFactory(event));

  const { events$, emit } = useEvents({
    key: `yagna${event.toUpperCase()}Events`,
    eventKind: getEventKind,
  });

  useEffect(() => {
    if (accessToken) {
      socketRef.current.auth = { token: accessToken };
      socketRef.current.connect();

      socketRef.current.on("event", (data: any) => {
        emit({ id: data.id, ...data[event] }, data.event.eventType);
      });
    }
  }, [accessToken]);

  return {
    events$,
  };
};

export const useYagnaEvents = () => {
  const { events$: debitNoteEvents$ } = useYagnaEvent(
    yagnaEventTopic.debitNote
  );
  const { events$: invoiceEvents$ } = useYagnaEvent(yagnaEventTopic.invoice);
  const { events$: agreementEvents$ } = useYagnaEvent(
    yagnaEventTopic.agreement
  );

  return {
    events$: merge(debitNoteEvents$, invoiceEvents$, agreementEvents$),
  };
};
