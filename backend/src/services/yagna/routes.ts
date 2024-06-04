import fastify, { FastifyInstance, FastifyRequest } from "fastify";
import { container } from "../../di.js";
import fastifyPlugin from "fastify-plugin";

export const Yagna = fastifyPlugin((fastify: FastifyInstance, opts, done) => {
  fastify.post("/allocation", {
    onRequest: [fastify.authenticate],
    handler: async (request, reply) => {
      const requestUser = request.user;
      const Yagna = container.cradle.Yagna;
      // try {
      //   await Yagna.createExecutor(requestUser._id);
      // } catch (e) {
      //   console.log("error", e);
      //   reply.code(500).send({
      //     message: "Unable to create executor",
      //   });
      // }
      const allocation = await Yagna.createUserAllocation(requestUser._id);
      // const allocation = await Yagna.getUserAllocation(requestUser._id);
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
  fastify.get("/allocation", {
    onRequest: [fastify.authenticate],
    handler: async (request, reply) => {
      const requestUser = request.user;
      const Yagna = container.cradle.Yagna;
      const allocation = await Yagna.getUserAllocation(requestUser._id);
      if (!allocation) {
        reply.code(500).send({
          message: "No allocation found",
        });
      } else {
        reply.code(200).send(allocation);
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
  fastify.post("/create-agreement", {
    onRequest: [fastify.authenticate],
    handler: async (request, reply) => {
      console.log("making agreement");
      const requestUser = request.user;
      const Yagna = container.cradle.Yagna;
      const user = await container.cradle.userService.getUserById(
        requestUser._id
      );
      try {
        const agreement = await Yagna.makeAgreement(requestUser._id);

        console.log("agreement", agreement);
      } catch (e) {
        console.log("error", e);
      }

      // const requestUser = request.user;
      // const Yagna = container.cradle.Yagna;
      // const user = await container.cradle.userService.getUserById(
      //   requestUser._id
      // );
      // const worker = await Yagna.getUserWorker(requestUser._id);
      // await worker.context?.activity.start();
      // if (!user?.currentAllocationId) {
      //   reply.code(500).send({
      //     message: "No allocation found",
      //   });
      // } else {
      //   container.cradle.userService.setCurrentActivityId(
      //     requestUser._id,
      //     worker.context?.activity.id
      //   );
      //   reply
      //     .code(201)
      //     .send(container.cradle.userService.getUserDTO(requestUser._id));
      // }
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
          type: "NO_ALLOCATION_TO_TOP_UP",
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
