import Fastify, { FastifyInstance } from "fastify";
import fastifySensible from "@fastify/sensible";
import cors from "@fastify/cors";
import { loginWithCrypto } from "loginWithCrypto/fastify";
import { container } from "./di.js";
import { paymentService } from "./services/payment/routes.js";
import { fileService } from "./services/file/routes.js";
import { userService } from "./services/user/routes.js";
import { FastifySSEPlugin } from "fastify-sse-v2";
import fastifyMultipart from "@fastify/multipart";
import { Yagna } from "./services/yagna/routes.js";

export const startupFastifyServer = async (): Promise<FastifyInstance> => {
  const fastify = Fastify({
    logger: true,
  });

  fastify.register(fastifySensible);
  fastify.register(fastifyMultipart);
  fastify.register(FastifySSEPlugin);

  fastify.register(cors, {
    origin: "*",
  });

  fastify.register(loginWithCrypto, {
    userService: container.cradle.userService,
  });

  fastify.register(paymentService);
  fastify.register(fileService);
  fastify.register(userService);
  fastify.register(Yagna);
  fastify.listen(
    { port: Number(process.env.PORT), host: process.env.HOST },
    (err) => {
      if (err) {
        fastify.log.error(err);
        throw err;
      }
    }
  );

  return fastify;
};

declare module "fastify" {
  interface FastifyInstance {
    authenticate: () => void;
  }
  interface FastifyRequest {
    user: {
      _id: string;
    };
  }
}
