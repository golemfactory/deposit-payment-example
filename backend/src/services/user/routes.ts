import fastify, { FastifyInstance, FastifyRequest } from "fastify";
import { container } from "../../di.js";
import fastifyPlugin from "fastify-plugin";

export const userService = fastifyPlugin(
  (fastify: FastifyInstance, opts, done) => {
    fastify.get("/me", {
      onRequest: [fastify.authenticate],
      handler: async (request: FastifyRequest, reply) => {
        console.log("using mongo uri", container.cradle.connectionString);
        const userService = container.cradle.userService;
        const requestUser = request.user;
        const user = await userService.findById(requestUser._id);

        console.log("user", user);
        if (!user) {
          throw new Error(`User not found with id ${requestUser._id}`);
        }
        return {
          walletAddress: user.walletAddress,
          _id: user._id.toString(),
          nonce: user.nonce.toString(),
          currentAllocation: {
            id: user.currentAllocationId,
          },
          currentActivity: {
            id: user.currentActivityId,
          },
          deposits: user.deposits.map((d) => {
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
