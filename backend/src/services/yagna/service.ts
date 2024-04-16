import { Subject } from "rxjs";
import * as YaTsClient from "ya-ts-client";
import { debugLog } from "../../utils.js";
import { container } from "../../di.js";
import { CustomError as Error } from "../../errors/error.js";
import { ErrorCode } from "../../errors/codes.js";
import dayjs from "dayjs";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

import { Worker } from "./worker.js";
import { WorkContext } from "@golem-sdk/golem-js";
import { Task } from "node_modules/@golem-sdk/task-executor/dist/task.js";
import { TaskExecutor } from "@golem-sdk/task-executor";
export class Yagna {
  public debitNoteEvents: Subject<any>;
  private paymentService: YaTsClient.PaymentApi.RequestorService;
  private isRunning: boolean = true;
  private YagnaConfig: { appKey: string; apiUrl: string };
  private lastDebitNoteEventTimestamp: string = new Date().toISOString();
  private lastInvoiceEventTimestamp: string = new Date().toISOString();
  private userContext = {
    data: new Map<
      string,
      {
        worker?: Worker;
        executor: TaskExecutor;
      }
    >(),
    setExecutor: (userId: string, executor: TaskExecutor) => {
      this.userContext.data.set(userId, { executor });
    },
    getExecutor: (userId: string) => {
      return this.userContext.data.get(userId)?.executor;
    },
    setWorker: (userId: string, worker: Worker) => {
      const executor = this.userContext.getExecutor(userId);
      if (!executor) {
        throw new Error(ErrorCode.NO_ALLOCATION);
      } else {
        this.userContext.data.set(userId, { executor, worker });
      }
    },
    getWorker: (userId: string) => {
      return this.userContext.data.get(userId)?.worker;
    },
  };

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
  //task executor creates allocation as well
  async createExecutor(userId: string) {
    const userService = container.cradle.userService;
    const userDeposit = await userService.getCurrentDeposit(userId);

    if (!userDeposit) {
      throw new Error(ErrorCode.NO_DEPOSIT);
    }

    const TaskExecutor = container.cradle.GolemSDK.TaskExecutor;

    const executor = await TaskExecutor.create({
      package: "pociejewski/clamav:latest",
      //here I would like to be able to pass SUBNET but i have to do that usiong env
      yagnaOptions: {
        apiKey: container.cradle.YagnaConfig.appKey,
      },
      allocation: {
        deposit: {
          contract: container.cradle.contractAddress,
          id: userDeposit.id.toString(16),
        },
        //TODO: would be better to accept timestamp not expiration from now
        expirationSec: Number(userDeposit.validTo) - dayjs().unix() - 1000,
      },
      agreementMaxPoolSize: 1,
      budget: Number(userDeposit.amount),
    });

    this.userContext.setExecutor(userId, executor);
  }

  //task executor creates agreement and activity
  async getUserWorker(userId: string): Promise<Worker> {
    return new Promise(async (resolve, reject) => {
      const worker = this.userContext.getWorker(userId);

      if (worker) {
        await worker.isConnected();
        resolve(worker);
        return;
      }

      //@ts-ignore

      const isMockMode = container.cradle.mode === "mock";

      const newWorker = new Worker();
      this.userContext.setWorker(userId, newWorker);
      newWorker.setState("connecting");
      if (isMockMode) {
        await sleep(1000);
        newWorker.setState("free");
        resolve(newWorker);
        return;
      } else {
        const userService = container.cradle.userService;
        const userDeposit = await userService.getCurrentDeposit(userId);
        if (!userDeposit) {
          throw new Error(ErrorCode.NO_DEPOSIT);
        }
        const executor = this.userContext.getExecutor(userId);
        if (!executor) {
          throw new Error(ErrorCode.NO_ALLOCATION);
        }
        executor
          .run(async (ctx: WorkContext) => {
            newWorker.context = ctx;
            newWorker.setState("free");
            resolve(newWorker);
          })
          .catch((e: any) => {
            console.log("Error", e);
          });
      }
    });
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
