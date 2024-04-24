import fastify, { FastifyInstance, FastifyRequest } from "fastify";
import { container } from "../../di.js";
import fastifyPlugin from "fastify-plugin";

export const Yagna = fastifyPlugin((fastify: FastifyInstance, opts, done) => {
  fastify.post("/create-allocation", {
    onRequest: [fastify.authenticate],
    handler: async (request, reply) => {
      const requestUser = request.user;
      const Yagna = container.cradle.Yagna;
      try {
        await Yagna.createExecutor(requestUser._id);
      } catch (e) {
        console.log("error", e);
        reply.code(500).send({
          message: "Unable to create executor",
        });
      }
      const allocation = await Yagna.getUserAllocation(requestUser._id);
      console.log("allocation", allocation);
      if (!allocation) {
        reply.code(500).send({
          message: "Unable to create allocation",
        });
      } else {
        await container.cradle.userService.setCurrentAllocationId(
          requestUser._id,
          allocation.allocationId
        );

        reply
          .code(201)
          .send(container.cradle.userService.getUserDTO(requestUser._id));
      }
    },
  });
  fastify.post("/release-allocation", {
    onRequest: [fastify.authenticate],
    handler: async (request, reply) => {
      const requestUser = request.user;
      const Yagna = container.cradle.Yagna;
      const user = await container.cradle.userService.getUserById(
        requestUser._id
      );
      if (!user?.currentAllocationId) {
        reply.code(500).send({
          message: "No allocation found",
        });
      } else {
        await Yagna.releaseAllocation(user.currentAllocationId);
        container.cradle.userService.setCurrentAllocationId(
          requestUser._id,
          ""
        );

        reply
          .code(201)
          .send(container.cradle.userService.getUserDTO(requestUser._id));
      }
    },
  });

  fastify.post("/release-agreement", {
    onRequest: [fastify.authenticate],
    handler: async (request, reply) => {
      const requestUser = request.user;
      const Yagna = container.cradle.Yagna;
      const user = await container.cradle.userService.getUserById(
        requestUser._id
      );
      const worker = await Yagna.getUserWorker(requestUser._id);
      await worker.context?.activity.stop();
      if (!user?.currentActivityId) {
        reply.code(500).send({
          message: "No agreement found",
        });
      } else {
        container.cradle.userService.setCurrentActivityId(requestUser._id, "");
        reply
          .code(201)
          .send(container.cradle.userService.getUserDTO(requestUser._id));
      }
    },
  });

  fastify.get("/requestor", {
    handler: async (request, reply) => {
      const wallet = await container.cradle.Yagna.getRequestorWalletAddress();
      reply.code(200).send({ wallet });
    },
  });

  fastify.put("/top-up-allocation", {
    onRequest: [fastify.authenticate],
    schema: {
      body: {
        type: "object",
        properties: {
          amount: { type: "number" },
        },
        required: ["amount"],
      },
    },
    handler: async (
      request: FastifyRequest<{
        Body: {
          amount: number;
        };
      }>,
      reply
    ) => {
      const requestUser = request.user;
      const Yagna = container.cradle.Yagna;
      const user = await container.cradle.userService.getUserById(
        requestUser._id
      );

      if (!user?.currentAllocationId) {
        reply.code(500).send({
          message: "No allocation found",
        });
      } else {
        await Yagna.topUpAllocation(
          user.currentAllocationId,
          request.body.amount
        );
        reply
          .code(201)
          .send(container.cradle.userService.getUserDTO(requestUser._id));
      }
    },
  });

  done();
});
