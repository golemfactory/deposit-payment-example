import * as sdk from "@golem-sdk/task-executor";
import { Observable, ReplaySubject, Subject } from "rxjs";
import { BehaviorSubject } from "rxjs";
import { Allocation, WorkContext } from "@golem-sdk/golem-js";
import { fileURLToPath } from "url";
import { IScanResult, fileStatus } from "./types.js";
import { container } from "../../di.js";
import { successScanResult, virusScanResult } from "./mock.js";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const DIR_NAME = fileURLToPath(new URL("../../../../temp/", import.meta.url));

type WorkerType = {
  context: WorkContext;
  setState: (newState: "busy" | "free" | "connecting") => void;
  getState: () => string;
  isFree: (fileId: string) => Promise<void>;
  isConnected: () => Promise<void>;
  queue: any[];
  addFileToQueue: (fileId: string) => void;
};

class Worker {
  constructor(public context: WorkContext & { allocation: Allocation }) {}
  private stateSubject: BehaviorSubject<string> = new BehaviorSubject(
    "connecting"
  );
  state$ = this.stateSubject.asObservable();
  private queue: any[] = [];

  addFileToQueue(fileId: string) {
    this.queue.push(fileId);
  }

  pullFileFromQueue(fileId: string) {
    this.queue = this.queue.filter((id) => id !== fileId);
  }

  setState(newState: "busy" | "free" | "connecting") {
    this.stateSubject.next(newState);
  }

  getState() {
    return this.stateSubject.value;
  }

  isFree(fileId: string): Promise<void> {
    return new Promise((resolve) => {
      const subscription = this.state$.subscribe((state) => {
        const isFirstInQueue = this.queue[this.queue.length - 1] === fileId;
        if (state === "free" && isFirstInQueue) {
          console.log("Worker is free now");
          // subscription.unsubscribe();
          resolve();
        }
      });
    });
  }
  isConnected(): Promise<void> {
    return new Promise((resolve) => {
      const subscription = this.state$.subscribe((state) => {
        if (state !== "connecting") {
          console.log("Worker is connected now");
          // subscription.unsubscribe();
          resolve();
        }
      });
    });
  }
}

export const fileService = (
  GolemSDK: typeof sdk,
  contractAddress: any
): {
  workers: Record<string, Worker>;
  getUserWorker: (userId: string, depositId: bigint) => Promise<Worker>;
  scanFileOnGolem: (fileName: string, worker: Worker) => Promise<any>;
  resultStream: Subject<IScanResult>;
  processFile: (fileName: string, userId: string, depositId: bigint) => void;
  init: () => void;
} => {
  console.log("creating file service", contractAddress);

  return {
    resultStream: new Subject<IScanResult>(),
    workers: {},
    init() {
      this.resultStream.subscribe((result) => {
        //TODO : save to db
        //scanResultModel.create(result);
      });
    },
    async getUserWorker(userId: string, depositId: bigint) {
      return new Promise(async (resolve, reject) => {
        const hasWorker = this.workers[userId];
        const isWorkerConnected =
          hasWorker && this.workers[userId].getState() !== "connecting";
        if (hasWorker && isWorkerConnected) {
          resolve(this.workers[userId]);
          return;
        } else if (hasWorker && !isWorkerConnected) {
          await this.workers[userId].isConnected();
          resolve(this.workers[userId]);
          return;
        }
        //@ts-ignore
        this.workers[userId] = new Worker(null);

        let executor;
        const isMockMode = container.cradle.mode === "mock";
        if (isMockMode) {
          await sleep(1000);
          this.workers[userId].setState("free");
          resolve(this.workers[userId]);
          return;
        } else {
          executor = await GolemSDK.TaskExecutor.create({
            package: "pociejewski/clamav:latest",
            //here I would like to be able to pass SUBNET but i have to do that usiong env
            yagnaOptions: {
              apiKey: container.cradle.YagnaConfig.appKey,
            },
            allocation: {
              deposit: {
                contract: contractAddress,
                id: depositId.toString(16),
              },
            },
            budget: 12,
          });
          console.log("Executor created ");
          executor.events.on("end", (event: any) => {
            console.log("Event", event);
          });
          executor
            .run(async (ctx: WorkContext) => {
              console.log("Connected to Golem");

              const workerContext = ctx;
              //@ts-ignore
              workerContext.allocation =
                ctx.activity.agreement.proposal.demand.allocation;

              console.log(
                "Connected to Golem",
                ctx.activity.agreement.proposal.demand.allocation.id
              );
              container.cradle.userService.setCurrentAllocationId(
                userId,
                ctx.activity.agreement.proposal.demand.allocation.id
              );

              //@ts-ignore
              this.workers[userId].context = workerContext;

              this.workers[userId].setState("free");

              resolve(this.workers[userId]);
            })
            .catch((e: any) => {
              console.log("Error", e);
            });
        }
      });
    },

    async scanFileOnGolem(fileName: string, worker: Worker) {
      const isMockMode = container.cradle.mode === "mock";

      if (isMockMode) {
        await sleep(Math.random() * 3000);
        const isVirus = fileName.includes("virus");
        if (isVirus) {
          return virusScanResult(fileName);
        } else {
          return successScanResult(fileName);
        }
      }

      console.log("Scanning file on Golem", fileName);

      //TODO handle errors and timeouts
      //but it seems that there was no try to find another one
      //this is task executor abstraction so it should handle it for me

      const results = await worker.context
        .beginBatch()
        .uploadFile(`${DIR_NAME}${fileName}`, `/golem/workdir/${fileName}`)
        .run(`/golem/scripts/clamscan-json.sh /golem/workdir/${fileName}`)
        .run("ls /golem/output/")
        .run(`cat /golem/output/temp/metadata.json`)
        .end();

      return JSON.parse((results[3].stdout || "null") as string);
    },
    async processFile(fileName: string, userId: string, depositId: bigint) {
      userId = userId || "default";

      const worker = await this.getUserWorker(userId, depositId);

      console.log("has worker");
      worker.addFileToQueue(fileName);

      await worker.isFree(fileName);

      worker.setState("busy");

      const scanResult = await this.scanFileOnGolem(fileName, worker);

      worker.setState("free");

      if (scanResult) {
        console.log("scanResult", scanResult);
        this.resultStream.next({
          result: scanResult.Viruses ? fileStatus.INFECTED : fileStatus.CLEAN,
          id: fileName,
          data: scanResult,
        });
      } else {
        this.resultStream.next({
          result: "error",
          data: {
            error: "Error scanning file",
          },
          id: fileName,
        });
      }

      //why results are in array?
      //I would lijet to use it like

      //worker.pipe(
      // uploadFile,
      // clamAV,
      // downloadResult
      //)

      //
      // await executor.run(async (ctx: any) => console.log((await ctx.run("echo 'Hello World'")).stdout));
    },
  };
};
