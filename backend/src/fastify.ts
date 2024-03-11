import Fastify, { FastifyInstance } from "fastify";
import fastifySensible from "@fastify/sensible";
import cors from "@fastify/cors";
import { loginWithCrypto } from "loginWithCrypto/fastify";
import { container } from "./di.js";
import { paymentService } from "./services/payment/routes.js";
import { fileService } from "./services/file/routes.js";
export const startupFastifyServer = async (): Promise<FastifyInstance> => {
  const fastify = Fastify({
    logger: true,
  });

  fastify.register(fastifySensible);

  fastify.register(loginWithCrypto, {
    userService: container.cradle.userService,
  });

  fastify.register(paymentService);
  console.log("fileService", fileService);
  fastify.register(fileService);

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
