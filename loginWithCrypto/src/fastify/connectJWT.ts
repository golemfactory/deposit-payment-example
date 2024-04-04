import fastifyPlugin from "fastify-plugin";
import jwt from "@fastify/jwt";
import { FastifyReply, FastifyRequest } from "fastify";
import { cp } from "fs";
import config from "../utils/ensureEnv.js";

export const connectJWT = fastifyPlugin(function (fastify, opts, done) {
  fastify.register(jwt, {
    secret: config.JWT_SECRET,
  });
  fastify.decorate(
    "authenticate",
    async function (request: FastifyRequest, reply: FastifyReply) {
      const { headers } = request;
      console.log("headers", headers);
      try {
        await request.jwtVerify();
      } catch (err) {
        console.log("err verify", err);
        await reply.send(err);
      }
    }
  );
  done();
});
