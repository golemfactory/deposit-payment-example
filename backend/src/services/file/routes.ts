import fastify, { FastifyInstance } from "fastify";
import { container } from "../../di.js";
import fastifyPlugin from "fastify-plugin";

export const fileService = fastifyPlugin((fastify: FastifyInstance, opts, done) => {
  fastify.post("/process-file", {
    schema: {
      body: {
        properties: {
          nonce: {
            type: "string",
          },
          funder: {
            type: "string",
          },
        },
        required: ["nonce", "funder"],
      },
    },
    handler: async (request, reply) => {
      container.cradle.fileService.processFile();
    },
  });
  done();
});
