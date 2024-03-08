import fastify, { FastifyInstance } from "fastify";
import { container } from "../../di.js";
import fastifyPlugin from "fastify-plugin";

export const paymentService = fastifyPlugin(
  (fastify: FastifyInstance, opts, done) => {
    fastify.post("/create-deposit", {
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
        const paymentService = container.cradle.paymentService;
        const res = await paymentService.saveDeposit(request.body);
        return res;
      },
    });
    done();
  }
);
