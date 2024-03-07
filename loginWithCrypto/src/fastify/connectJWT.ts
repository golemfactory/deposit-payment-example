import fastifyPlugin from "fastify-plugin";
import jwt from "@fastify/jwt";

export const connectJWT = fastifyPlugin(function (fastify, opts, done) {
  fastify.register(jwt, {
    secret: "dupa",
  });
  done();
});
