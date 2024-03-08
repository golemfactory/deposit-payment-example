import Fastify, { FastifyInstance } from "fastify";
import fastifySensible from "@fastify/sensible";
import cors from "@fastify/cors";
//@ts-ignore
import { loginWithCrypto } from "loginWithCrypto/fastify";
import { container } from "./di.js";
import { paymentService } from "./services/payment/routes.js";

export const startupFastifyServer = async (): Promise<FastifyInstance> => {
  const fastify = Fastify({
    logger: true,
  });

  fastify.register(fastifySensible);

  fastify.register(loginWithCrypto, {
    userService: container.cradle.userService,
  });

  fastify.register(paymentService);

  await fastify.register(cors, {
    origin: "*",
  });

  await fastify.listen({ port: Number(process.env.PORT) }, (err) => {
    if (err) {
      fastify.log.error(err);
      throw err;
    }
  });
  return fastify;
};
