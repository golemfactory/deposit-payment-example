import { Subject } from "rxjs";
import * as YaTsClient from "ya-ts-client";

import { debugLog } from "../../utils.js";
import { debug } from "console";

export class Yagna {
  public debitNoteEvents: Subject<any>;
  private paymentService: YaTsClient.PaymentApi.RequestorService;
  private isRunning: boolean = true;
  private YagnaConfig: { appKey: string; apiUrl: string };
  private lastDebitNoteEventTimestamp: string = new Date().toISOString();
  private lastInvoiceEventTimestamp: string = new Date().toISOString();

  constructor(YagnaConfig: { appKey: string; apiUrl: string }) {
    this.YagnaConfig = YagnaConfig;
    this.debitNoteEvents = new Subject();
    console.log("Yagna config", YagnaConfig);
    const paymentClient = new YaTsClient.PaymentApi.Client({
      BASE: `${YagnaConfig.apiUrl}/payment-api/v1`,
      HEADERS: {
        Authorization: `Bearer ${YagnaConfig.appKey}`,
      },
    });

    this.paymentService = paymentClient.requestor;
  }
  stop() {
    this.isRunning = false;
  }

  async observeDebitNoteEvents() {
    debugLog("payments", "observing events");
    while (this.isRunning) {
      debugLog(
        "payments",
        "fetching debit note events",
        this.lastDebitNoteEventTimestamp
      );
      const debitNoteEvents = await this.paymentService.getDebitNoteEvents(
        5,
        this.lastDebitNoteEventTimestamp,
        10,
        //@ts-ignore
        null
      );

      const invoiceEvents = await this.paymentService.getInvoiceEvents(
        5,
        this.lastDebitNoteEventTimestamp,
        10,
        //@ts-ignore
        null
      );

      debitNoteEvents.forEach((event: any) => {
        console.log("debit note event", event);
        const debitNoteId = event.debitNoteId;
        const debitNote = this.paymentService.getDebitNote(debitNoteId);
        console.log("debit note", debitNote);
        this.debitNoteEvents.next(debitNote);
        this.lastDebitNoteEventTimestamp = event.eventDate;
      });
    }

    while (this.isRunning) {
      const invoiceEvents = await this.paymentService.getInvoiceEvents(
        5,
        this.lastInvoiceEventTimestamp,
        10,
        //@ts-ignore
        null
      );

      invoiceEvents.forEach((event: any) => {
        console.log("invoice event", event);
        this.debitNoteEvents.next(event);
        this.lastInvoiceEventTimestamp = event.eventDate;
      });
    }
  }
}
