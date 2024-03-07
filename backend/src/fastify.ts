import Fastify, { FastifyInstance } from "fastify";
import fastifySensible from "@fastify/sensible";

import { loginWithCrypto } from "loginWithCrypto/fastify";

export const startupFastifyServer = async (): Promise<FastifyInstance> => {
  const fastify = Fastify({
    logger: true,
  });

  fastify.register(fastifySensible);

  fastify.register(loginWithCrypto);

  await fastify.listen({ port: Number(process.env.PORT) }, (err) => {
    if (err) {
      console.log(err);
      fastify.log.error(err);
      throw err;
    }
  });
  return fastify;
};
