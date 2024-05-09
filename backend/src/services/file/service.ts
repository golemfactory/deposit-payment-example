import * as sdk from "@golem-sdk/task-executor";
import { Subject } from "rxjs";
import { fileURLToPath } from "url";
import { IScanResult, fileStatus } from "./types.js";
import { container } from "../../di.js";
import { successScanResult, virusScanResult } from "./mock.js";
import { Worker } from "../yagna/worker.js";
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const DIR_NAME = fileURLToPath(new URL("../../../../temp/", import.meta.url));

import { debugLog } from "../../utils.js";

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
  return {
    resultStream: new Subject<IScanResult>(),
    workers: {},
    init() {
      this.resultStream.subscribe();
    },

    async scanFileOnGolem(fileName: string, worker: Worker) {
      debugLog("file", "Scanning file on Golem", fileName);
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

      //TODO handle errors and timeouts
      //but it seems that there was no try to find another one
      //this is task executor abstraction so it should handle it for me
      try {
        const results = await worker.context
          ?.beginBatch()
          .uploadFile(`${DIR_NAME}${fileName}`, `/golem/workdir/${fileName}`)
          .run(`/golem/scripts/clamscan-json.sh /golem/workdir/${fileName}`)
          .run("ls /golem/output/")
          .run(`cat /golem/output/temp/metadata.json`)
          .end();

        //@ts-ignore
        return JSON.parse((results[3].stdout || "null") as string);
      } catch (err) {
        debugLog("file", "Error scannin file", err);
        return null;
      }
    },
    async processFile(fileName: string, userId: string) {
      debugLog("file", "Processing file", fileName);
      const worker = await container.cradle.Yagna.getUserWorker(userId);
      worker.addFileToQueue(fileName);
      await worker.isFree(fileName);
      debugLog("file", "Worker is free", fileName);
      worker.setState("busy");
      const scanResult = await this.scanFileOnGolem(fileName, worker);
      debugLog("file", "Scan result", fileName, scanResult);
      worker.setState("free");

      if (scanResult) {
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
