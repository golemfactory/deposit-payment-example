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
import { createHmac } from "crypto";
export const fileService = (
  GolemSDK: typeof sdk,
  contractAddress: any
): {
  workers: Record<string, Worker>;
  scanFileOnGolem: (fileName: string, worker: Worker) => Promise<any>;
  resultStream: Subject<IScanResult>;
  processFile: (fileName: string, userId: string, depositId: bigint) => void;
  hashFileName: (fileName: string) => string;
  init: () => void;
} => {
  return {
    resultStream: new Subject<IScanResult>(),
    workers: {},
    init() {
      this.resultStream.subscribe();
    },

    hashFileName(fileName: string) {
      const secret = "65mkkmk4kkm";
      return createHmac("sha256", secret).update(fileName).digest("hex");
    },

    async scanFileOnGolem(fileName: string, worker: Worker) {
      debugLog("file", "Scanning file on Golem", fileName);
      const isMockMode = container.cradle.mode === "mock";
      const fileNameHash = this.hashFileName(fileName);

      if (isMockMode) {
        await sleep(Math.random() * 3000);
        const isVirus = fileName.includes("virus");
        if (isVirus) {
          return virusScanResult(fileNameHash);
        } else {
          return successScanResult(fileNameHash);
        }
      }

      //TODO handle errors and timeouts
      //but it seems that there was no try to find another one
      //this is task executor abstraction so it should handle it for me
      try {
        const results = await worker.context
          ?.beginBatch()
          .uploadFile(
            `${DIR_NAME}${fileName}`,
            `/golem/workdir/${fileNameHash}`
          )
          .run(
            `/golem/scripts/clamscan-json.sh "/golem/workdir/${fileNameHash}"`
          )
          .run(`cat /golem/output/temp/metadata.json`)
          .end();
        debugLog("file", "results", results);
        debugLog("file", "result", results ? results[2].stdout : "no results");
        //@ts-ignore
        return JSON.parse((results[2].stdout || "null") as string);
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
