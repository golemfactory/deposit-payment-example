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

        return {
          walletAddress: user.walletAddress,
          _id: user._id.toString(),
          nonce: user.nonce.toString(),
          currentAllocation: {},
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
        reply.code(200).send({
          message: "Allocation released",
        });
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
      console.log("releasing agreement", user?.currentActivityId);
      const worker = await Yagna.getUserWorker(requestUser._id);
      await worker.context?.activity.stop();
      if (!user?.currentActivityId) {
        reply.code(500).send({
          message: "No agreement found",
        });
      } else {
        // await Yagna.releaseAgreement(user.currentActivityId);
        container.cradle.userService.setCurrentActivityId(requestUser._id, "");

        const res = {
          walletAddress: user.walletAddress,
          _id: user._id.toString(),
          nonce: user.nonce.toString(),
          currentAllocation: {
            id: user.currentAllocationId,
          },
          currentActivity: {},
          deposits: user.deposits.map((d) => {
            return {
              isCurrent: d.isCurrent,
              isValid: d.isValid,
              nonce: d.nonce.toString(),
            };
          }),
        };
        reply.code(200).send(res);
      }
    },
  });
  done();
});
