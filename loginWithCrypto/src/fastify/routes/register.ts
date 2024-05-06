import { RouteOptions } from "fastify";

export const register: RouteOptions = {
  method: "POST",
  url: "/register",
  schema: {
    body: {
      type: "object",
      properties: {
        walletAddress: {
          type: "string",
          pattern: "^0x[a-fA-F0-9]{40}$",
        },
      },
      required: ["walletAddress"],
    },
  },
  handler: async (req, rep) => {
    // @ts-ignore temporary
    const { walletAddress } = req.body;
    // @ts-ignore temporary
    const { userService } = req.routeOptions.config;
    const user = await userService.registerUser(walletAddress);
    rep.send(user);
  },
};
