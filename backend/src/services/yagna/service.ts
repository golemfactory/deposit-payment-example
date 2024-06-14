import { Subject } from "rxjs";
import * as YaTsClient from "ya-ts-client";
import { debugLog } from "../../utils.js";
import { container } from "../../di.js";
import { CustomError as Error } from "../../errors/error.js";
import { ErrorCode } from "../../errors/codes.js";
import dayjs from "dayjs";
import bigDecimal from "js-big-decimal";

import { v4 as uuidv4 } from "uuid";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

import { Worker } from "./worker.js";
import { WorkContext } from "@golem-sdk/golem-js";
import { TaskExecutor } from "@golem-sdk/task-executor";
import { formatEther, parseEther } from "viem";
import { UUID } from "mongodb";
export class Yagna {
  public debitNoteEvents: Subject<any>;
  public invoiceEvents: Subject<any>;
  public agreementEvents: Subject<any>;

  private paymentService: YaTsClient.PaymentApi.RequestorService;
  private activityService: YaTsClient.MarketApi.RequestorService;
  private identityService: YaTsClient.IdentityApi.DefaultService;
  private isRunning: boolean = true;
  private YagnaConfig: { appKey: string; apiUrl: string };
  private lastDebitNoteEventTimestamp: string = new Date().toISOString();
  private lastInvoiceEventTimestamp: string = new Date().toISOString();
  private lastAgreementEventTimestamp: string = new Date().toISOString();
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
        return existingExecutor;
      }
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

  constructor(YagnaConfig: { appKey: string; apiUrl: string }) {
    this.YagnaConfig = YagnaConfig;

    this.debitNoteEvents = new Subject();
    this.invoiceEvents = new Subject();
    this.agreementEvents = new Subject();

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
    this.identityService = new YaTsClient.IdentityApi.Client({
      BASE: `${YagnaConfig.apiUrl}`,
      HEADERS: {
        Authorization: `Bearer ${YagnaConfig.appKey}`,
      },
    }).default;
  }

  async makeAgreement(userId: string) {
    //creating executor by task executor makes agreement
    const executor = await this.userContext.getExecutor(userId);
    //in order to make sure agreement wont be automatically closed after 90s
    //which is HARDCODED in yagna we make worker which under the hood makes activity
    // which prevents agreement from closing
    const worker = await this.getUserWorker(userId);

    const agreement = await worker.context?.activity.agreement;

    if (!agreement) {
      throw new Error({
        code: ErrorCode.AGREEMENT_NOT_FOUND,
        payload: {
          agreementId: "",
        },
      });
    }
    container.cradle.userService.setCurrentAgreementId(userId, agreement.id);
    agreement.events.on("terminated", (e: any) => {
      this.agreementEvents.next({
        agreement,
        event: "terminated",
      });
    });
  }

  async getUserAgreement(userId: string) {
    const user = await container.cradle.userService.getUserById(userId);
    if (!user) {
      throw new Error({ code: ErrorCode.USER_NOT_FOUND });
    }
    const agreementId = user.currentAgreementId;
    if (!agreementId) {
      return null;
    }
    const agreement = await this.activityService.getAgreement(agreementId);
    if (!agreement) {
      throw new Error({
        code: ErrorCode.AGREEMENT_NOT_FOUND,
        payload: {
          agreementId,
        },
      });
    }
    return { ...agreement, id: agreementId };
  }

  async createUserAllocation(userId: string) {
    const userService = container.cradle.userService;
    const userDeposit = await userService.getCurrentDeposit(userId);
    console.log("creating allocation userDeposit", userDeposit);
    if (!userDeposit) {
      throw new Error({ code: ErrorCode.NO_DEPOSIT });
    }
    try {
      // @ts-ignore
      const allocation = await this.paymentService.createAllocation({
        totalAmount: formatEther(userDeposit.amount),
        makeDeposit: false,
        deposit: {
          contract: container.cradle.contractAddress,
          id: BigInt(userDeposit.id).toString(16),
          validate: {
            flatFeeAmount: userDeposit.feeAmount.toString(),
          },
          // @ts-ignore
          spender: userDeposit.spender,
        },
        timeout: new Date(
          Number(userDeposit.validTo) * 1000 - 1000
        ).toISOString(),
      });

      container.cradle.userService.setCurrentAllocationId(
        userId,
        allocation.allocationId
      );
      return allocation;
    } catch (e) {
      console.log("Error creating allocation", e);
      throw e;
    }
    // @ts-ignore
  }
  async getUserAllocation(userId: string) {
    const user = await container.cradle.userService.getUserById(userId);
    if (!user) {
      throw new Error({ code: ErrorCode.USER_NOT_FOUND });
    }
    const allocationId = user.currentAllocationId;
    if (!allocationId) {
      return null;
    }
    const allocation = await this.paymentService.getAllocation(allocationId);
    if (!allocation) {
      return null;
    }
    return { ...allocation, id: allocationId };
  }

  stop() {
    this.isRunning = false;
  }

  // I would prefer this methods to be on the Allocation

  releaseAllocation(allocationId: string) {
    return this.paymentService.releaseAllocation(allocationId);
  }

  releaseAgreement(activityId: string) {
    debugLog("payments", "releasing agreement", activityId);
    return this.activityService.terminateAgreement(activityId);
  }

  async getRequestorWalletAddress() {
    return (await this.identityService.getIdentity()).identity;
  }

  async topUpAllocation(allocationId: string, amount: number) {
    const currentAllocation =
      await this.paymentService.getAllocation(allocationId);

    const currentAmount = new bigDecimal.default(currentAllocation.totalAmount);
    const additionalAmount = new bigDecimal.default(amount);
    console.log("calling yagna");
    console.log(
      "new total amout ",
      currentAmount.add(additionalAmount).getValue()
    );

    try {
      this.paymentService.amendAllocation(allocationId, {
        totalAmount: currentAmount.add(additionalAmount).getValue(),
      });
    } catch (e) {
      console.log("error", e);
    }
  }

  //task executor creates allocation as well
  async createExecutor(userId: string) {
    debugLog("payments", "creating executor", userId);
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

    //@ts-ignore
    if (allocation?.id) {
      debugLog("payments", "allocation already exists, reusing", allocation);
    }

    const executor = await TaskExecutor.create({
      package: "pociejewski/clamav:latest",
      yagnaOptions: {
        apiKey: container.cradle.YagnaConfig.appKey,
      },
      allocation: allocation,
      agreementMaxPoolSize: 1,
      //@ts-ignore
      budget: formatEther(userDeposit.amount),
      enableLogging: true,
      subnetTag: container.cradle.YagnaConfig.subnetTag,
    });

    this.userContext.setExecutor(userId, executor);
    container.cradle.userService.setCurrentAllocationId(
      userId,
      executor.allocation.id
    );
    executor.allocation;
    return executor;
  }

  //task executor creates agreement and activity
  async getUserWorker(userId: string): Promise<Worker> {
    debugLog("payments", "getting user worker", userId);
    return new Promise(async (resolve, reject) => {
      const worker = this.userContext.getWorker(userId);
      if (worker) {
        debugLog("yagna", "worker found", userId);
        const isConnected = await worker.isConnected();
        if (isConnected) {
          debugLog("yagna", "worker connected", userId);
          resolve(worker);
          return;
        }
      }

      //@ts-ignore

      const isMockMode = container.cradle.mode === "mock";
      debugLog("yagna", "creating worker", userId);
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

            resolve(newWorker);
          })
          .catch((e: any) => {
            console.log("Error", e);
            reject();
          });
      }
    });
  }

  //TODO : extract common logic

  async observeDebitNoteEvents() {
    debugLog("payments", "observing events");
    while (this.isRunning) {
      const debitNoteEvents = await this.paymentService.getDebitNoteEvents(
        5,
        this.lastDebitNoteEventTimestamp,
        10
      );

      debitNoteEvents.forEach((event) => {
        if (
          dayjs(event.eventDate).isAfter(
            dayjs(this.lastDebitNoteEventTimestamp)
          )
        ) {
          this.lastDebitNoteEventTimestamp = event.eventDate;
        }
      });

      debitNoteEvents.forEach(async (event: any) => {
        console.log("debit note event", event);
        const debitNoteId = event.debitNoteId;
        const debitNote = await this.paymentService.getDebitNote(debitNoteId);
        this.debitNoteEvents.next({
          debitNote,
          event,
          id: uuidv4(),
        });
      });
    }
  }

  async observeInvoiceEvents() {
    debugLog("payments", "observing events");
    while (this.isRunning) {
      const invoiceEvents = await this.paymentService.getInvoiceEvents(
        5,
        this.lastInvoiceEventTimestamp,
        10
      );

      invoiceEvents.forEach((event) => {
        if (
          dayjs(event.eventDate).isAfter(dayjs(this.lastInvoiceEventTimestamp))
        ) {
          this.lastInvoiceEventTimestamp = event.eventDate;
        }
      });

      invoiceEvents.forEach(async (event: any) => {
        console.log("invoice event", event);
        const invoiceId = event.invoiceId;
        const invoice = await this.paymentService.getInvoice(invoiceId);
        this.invoiceEvents.next({ invoice, event, id: uuidv4() });
      });
    }
  }
  async observeAgreementEvents() {
    while (this.isRunning) {
      const events = await this.activityService.collectAgreementEvents(
        5,
        this.lastAgreementEventTimestamp,
        10
      );

      events.forEach((event) => {
        if (
          dayjs(event.eventDate).isAfter(
            dayjs(this.lastAgreementEventTimestamp)
          )
        ) {
          this.lastAgreementEventTimestamp = event.eventDate;
        }
      });

      events.forEach(async (event: any) => {
        const agreementId = event.agreementId;
        const agreement = await this.activityService.getAgreement(agreementId);

        if (event.eventType === "AgreementTerminatedEvent") {
          container.cradle.userService.onAgreementTerminated(agreementId);
        }

        this.agreementEvents.next({
          id: uuidv4(),
          agreement,
          event,
        });
      });
    }
  }
  async observeEvents() {
    this.observeDebitNoteEvents();
    this.observeInvoiceEvents();
    this.observeAgreementEvents();
  }
}
