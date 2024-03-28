import * as sdk from "@golem-sdk/golem-js";
import { Subject } from "rxjs";
import { fileURLToPath } from "url";

const DIR_NAME = fileURLToPath(new URL("../../../../temp/", import.meta.url));

console.log("DIR_NAME", DIR_NAME);
export const fileService = (
  GolemSDK: typeof sdk
): {
  workers: Record<string, sdk.WorkContext>;
  getUserWorker: (userId: string) => Promise<sdk.WorkContext>;
  resultStream: Subject<any>;
  processFile: (fileName: string, userId: string) => void;
} => {
  return {
    resultStream: new Subject(),
    workers: {},
    async getUserWorker(userId: string) {
      return new Promise(async (resolve, reject) => {
        console.log("workers", this.workers);
        if (this.workers[userId]) {
          resolve(this.workers[userId]);
        }
        const executor = await GolemSDK.TaskExecutor.create({
          package: "pociejewski/clamav:latest",
          yagnaOptions: {
            apiKey: "81d0ead5501e4395ade8b9c11361dee3",
          },
        });

        console.log("Creating new worker");
        executor
          .run(async (ctx) => {
            console.log("Worker created");
            this.workers[userId] = ctx;
            resolve(ctx);
          })
          .catch((e) => {
            console.log("Error", e);
          });
      });
    },
    async processFile(fileName: string, userId: string) {
      console.log("Processing file...");
      userId = userId || "default";

      const worker = await this.getUserWorker(userId);

      const result = await worker
        .beginBatch()
        .uploadFile(`${DIR_NAME}${fileName}`, `/golem/workdir/${fileName}`)
        .run("ls /golem/scripts/")
        .run(`/golem/scripts/clamscan-json.sh /golem/workdir/${fileName}`)
        .run("ls /golem/output/")
        .run(`cat /golem/output/temp/metadata.json`)
        .end();

      console.log("Im done", result[4].stdout);
      console.log("Im done", JSON.parse(result[4].stdout as string));

      //czemu te resulty są w tablivcu ?
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
