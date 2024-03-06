import { connectRoutes } from "./connectRoutes.js";
import { config } from "../utils/ensureEnv.js";
import fastifyPlugin from "fastify-plugin";
import { connectJWT } from "./connectJWT.js";

export const loginWithCrypto = fastifyPlugin(function (fastify, opts, done) {
  console.log("optss", opts);
  fastify.register(connectJWT, config);
  fastify.register(connectRoutes);
  done();
});
