import fastify, { FastifyInstance } from "fastify";
import { container } from "../../di.js";
import fastifyPlugin from "fastify-plugin";
import util from "node:util";
import { pipeline } from "node:stream";
import fs from "node:fs";
import { fileURLToPath } from "url";

const DIR_NAME = fileURLToPath(new URL("../../../../temp/", import.meta.url));
export const fileService = fastifyPlugin(
  (fastify: FastifyInstance, opts, done) => {
    fastify.post("/process-file", {
      schema: {
        body: {
          properties: {},
        },
      },
      handler: async (request, reply) => {
        const data = await request.file();

        if (!data) {
          reply.code(400).send({ message: "No file uploaded" });
          return;
        }

        //accoumulate the file in memory
        await util.promisify(pipeline)(
          data.file,
          fs.createWriteStream(`${DIR_NAME}/${data.filename}`)
        );

        console.log("Processing file...");
        container.cradle.fileService.processFile(data?.filename, "");
      },
    });
    done();
  }
);
