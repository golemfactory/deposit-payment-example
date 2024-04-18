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
import { formatEther } from "viem";
export class Yagna {
  public debitNoteEvents: Subject<any>;
  private paymentService: YaTsClient.PaymentApi.RequestorService;
  private activityService: YaTsClient.MarketApi.RequestorService;
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
    getExecutor: async (userId: string) => {
      const existingExecutor = this.userContext.data.get(userId)?.executor;
      if (existingExecutor) {
        console.log("executor exists");
        return existingExecutor;
      }
      console.log("creating executor");
      return await this.createExecutor(userId);
    },
    setWorker: async (userId: string, worker: Worker) => {
      const executor = await this.userContext.getExecutor(userId);
      if (!executor) {
        throw new Error({ code: ErrorCode.NO_ALLOCATION });
      } else {
        this.userContext.data.set(userId, { executor, worker });
      }
    },
    getWorker: (userId: string) => {
      return this.userContext.data.get(userId)?.worker;
    },
  };

  async getUserAllocation(userId: string) {
    console.log("getting user allocation");
    const user = await container.cradle.userService.getUserById(userId);
    if (!user) {
      throw new Error({ code: ErrorCode.USER_NOT_FOUND });
    }
    const allocationId = user.currentAllocationId;
    console.log("allocationId", allocationId);
    if (!allocationId) {
      return null;
    }

    const allocation = await this.paymentService.getAllocation(allocationId);
    if (!allocation) {
      throw new Error({
        code: ErrorCode.ALLOCATION_NOT_FOUND,
        payload: {
          allocationId,
        },
      });
    }
    console.log("allocation gettersd", allocation);
    return allocation;
  }

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

    const activityClient = new YaTsClient.MarketApi.Client({
      BASE: `${YagnaConfig.apiUrl}/market-api/v1`,
      HEADERS: {
        Authorization: `Bearer ${YagnaConfig.appKey}`,
      },
    });

    this.paymentService = paymentClient.requestor;
    this.activityService = activityClient.requestor;
  }
  stop() {
    this.isRunning = false;
  }

  releaseAllocation(allocationId: string) {
    return this.paymentService.releaseAllocation(allocationId);
  }

  releaseAgreement(activityId: string) {
    return this.activityService.terminateAgreement(activityId);
  }
  //task executor creates allocation as well
  async createExecutor(userId: string) {
    const userService = container.cradle.userService;
    const userDeposit = await userService.getCurrentDeposit(userId);

    if (!userDeposit) {
      throw new Error({ code: ErrorCode.NO_DEPOSIT });
    }

    const TaskExecutor = container.cradle.GolemSDK.TaskExecutor;

    const allocation = (await this.getUserAllocation(userId)) || {
      deposit: {
        contract: container.cradle.contractAddress,
        id: userDeposit.id.toString(16),
      },
      expirationSec: Number(userDeposit.validTo) - dayjs().unix() - 1000,
    };

    console.log("allocation", allocation);

    const executor = await TaskExecutor.create({
      package: "pociejewski/clamav:latest",
      //here I would like to be able to pass SUBNET but i have to do that usiong env
      yagnaOptions: {
        apiKey: container.cradle.YagnaConfig.appKey,
      },
      allocation: allocation,
      agreementMaxPoolSize: 1,
      budget: Number(formatEther(userDeposit.amount)),
    });

    this.userContext.setExecutor(userId, executor);
    container.cradle.userService.setCurrentAllocationId(
      userId,
      executor.allocation.id
    );
    return executor;
  }

  //task executor creates agreement and activity
  async getUserWorker(userId: string): Promise<Worker> {
    return new Promise(async (resolve, reject) => {
      const worker = this.userContext.getWorker(userId);
      console.log("getting user worker", worker);
      if (worker) {
        const isConnected = await worker.isConnected();
        if (isConnected) {
          resolve(worker);
          return;
        }
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
          throw new Error({ code: ErrorCode.NO_DEPOSIT });
        }
        const executor = await this.userContext.getExecutor(userId);
        if (!executor) {
          throw new Error({ code: ErrorCode.NO_ALLOCATION });
        }
        executor
          .run(async (ctx: WorkContext) => {
            newWorker.context = ctx;

            newWorker.setState("free");
            container.cradle.userService.setCurrentActivityId(
              userId,
              ctx.activity.agreement.id
            );
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
