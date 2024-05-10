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
          },
          required: ["nonce", "funder"],
        },
      },
      //@ts-ignore TODO: add declaration in auth module so ts-ignore is not needed
      onRequest: [fastify.authenticate],
      handler: async (request, reply) => {
        console.log("wtf creating deposit"); 
        const paymentService = container.cradle.paymentService;
        // @ts-ignore
        // TODO: make sure request.body is the right type
        const res = await paymentService.saveDeposit(
          request.user._id,
          // @ts-ignore
          request.body.nonce
        );

        console.log("res",res); 
        return res;
      },
    });
    done();
  }
);
