import fastify, { FastifyInstance, FastifyRequest } from "fastify";
import { container } from "../../di.js";
import fastifyPlugin from "fastify-plugin";

export const userService = fastifyPlugin(
  (fastify: FastifyInstance, opts, done) => {
    fastify.get("/me", {
      onRequest: [fastify.authenticate],
      handler: async (request: FastifyRequest, reply) => {
        const userService = container.cradle.userService;
        const user = request.user;
        const u = await userService.findById(user._id);
        if (!u) {
          throw new Error(`User not found with id ${user._id}`);
        }
        return {
          walletAddress: u.walletAddress,
          _id: u._id.toString(),
          nonce: u.nonce.toString(),
          deposits: u.deposits.map((d) => {
            return {
              isCurrent: d.isCurrent,
              isValid: d.isValid,
              nonce: d.nonce.toString(),
            };
          }),
        };
      },
    });

    done();
  }
);
