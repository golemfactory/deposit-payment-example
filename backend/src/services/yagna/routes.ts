import fastify, { FastifyInstance } from "fastify";
import { container } from "../../di.js";
import fastifyPlugin from "fastify-plugin";

export const Yagna = fastifyPlugin((fastify: FastifyInstance, opts, done) => {
  fastify.post("/create-allocation", {
    onRequest: [fastify.authenticate],
    handler: async (request, reply) => {
      const requestUser = request.user;
      const Yagna = container.cradle.Yagna;
      await Yagna.createExecutor(requestUser._id);
      const allocation = Yagna.getUserAllocation(requestUser._id);

      if (!allocation) {
        reply.code(500).send({
          message: "Unable to create allocation",
        });
      } else {
        container.cradle.userService.setCurrentAllocationId(
          requestUser._id,
          allocation.id
        );

        reply.code(201).send({
          allocationId: allocation.id,
        });
      }
    },
  });
  done();
});
