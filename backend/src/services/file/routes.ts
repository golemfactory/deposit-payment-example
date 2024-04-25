import fastify, { FastifyInstance } from "fastify";
import { container } from "../../di.js";
import fastifyPlugin from "fastify-plugin";
import util from "node:util";
import { pipeline } from "node:stream";
import fs from "node:fs";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import { mkdir } from "node:fs/promises";

const DIR_NAME = fileURLToPath(new URL("../../../../temp", import.meta.url));
export const fileService = fastifyPlugin(
  (fastify: FastifyInstance, opts, done) => {
    fastify.post("/process-file", {
      schema: {
        body: {
          properties: {},
        },
      },
      onRequest: [fastify.authenticate],
      handler: async (request, reply) => {
        const data = await request.file();

        if (!data) {
          reply.code(400).send({ message: "No file uploaded" });
          return;
        }

        try {
          await mkdir(DIR_NAME);
        } catch (e) {
          console.log("Error creating directory", e);
        }
        //accoumulate the file in memory
        await util.promisify(pipeline)(
          data.file,
          fs.createWriteStream(`${DIR_NAME}/${data.filename}`)
        );

        const deposit = await container.cradle.userService.getCurrentDeposit(
          request.user._id
        );

        if (!deposit) {
          throw new Error("Cant process file without deposit");
        }
        console.log("deposit", deposit);
        container.cradle.fileService.processFile(
          data?.filename,
          request.user._id,
          deposit.id
        );
        reply.send({ message: "File uploaded" });
      },
    });
    fastify.get("/scan-result", {
      handler: (request, reply) => {
        container.cradle.fileService.resultStream.subscribe((result) => {
          reply.sse({ data: JSON.stringify(result), id: uuidv4() });
        });
      },
    });

    done();
  }
);
