import { connectRoutes } from "./connectRoutes.js";
import config from "../utils/ensureEnv.js";
import fastifyPlugin from "fastify-plugin";
import { connectJWT } from "./connectJWT.js";

export const loginWithCrypto = fastifyPlugin<{
  userService: {};
}>(function (fastify, opts, done) {
  fastify.register(connectJWT, config);
  fastify.register(connectRoutes, opts);
  done();
});

declare module "fastify" {
  interface FastifyInstance {
    authenticate: () => void;
  }
}
