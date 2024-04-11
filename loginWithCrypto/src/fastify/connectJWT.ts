import fastifyPlugin from "fastify-plugin";
import jwt from "@fastify/jwt";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { cp } from "fs";
import config from "../utils/ensureEnv.js";

export const connectJWT = fastifyPlugin(function (
  fastify: FastifyInstance,
  opts,
  done
) {
  fastify.register(jwt, {
    secret: config.JWT_SECRET,
  });
  // @ts-ignore
  fastify.decorate("authenticate", async function (request, reply) {
    const { headers } = request;
    try {
      await request.jwtVerify();
    } catch (err) {
      console.log("err verify", err);
      await reply.send(err);
    }
  });
  done();
});
