import * as sdk from "@golem-sdk/task-executor";
import { Subject } from "rxjs";
import { fileURLToPath } from "url";
import { IScanResult, fileStatus } from "./types.js";
import { container } from "../../di.js";
import { successScanResult, virusScanResult } from "./mock.js";
import { Worker } from "../yagna/worker.js";
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const DIR_NAME = fileURLToPath(new URL("../../../../temp/", import.meta.url));

export const fileService = (
  GolemSDK: typeof sdk,
  contractAddress: any
): {
  workers: Record<string, Worker>;
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
        ?.beginBatch()
        .uploadFile(`${DIR_NAME}${fileName}`, `/golem/workdir/${fileName}`)
        .run(`/golem/scripts/clamscan-json.sh /golem/workdir/${fileName}`)
        .run("ls /golem/output/")
        .run(`cat /golem/output/temp/metadata.json`)
        .end();

      worker.context?.activity.stop();
      //@ts-ignore
      return JSON.parse((results[3].stdout || "null") as string);
    },
    async processFile(fileName: string, userId: string) {
      const worker = await container.cradle.Yagna.getUserWorker(userId);
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
    },
  };
};
