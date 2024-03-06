import { RouteOptions } from "fastify";

export const login: RouteOptions = {
  method: "POST",
  url: "/login",
  schema: {
    body: {
      type: "object",
      properties: {
        address: {
          type: "string",
          pattern: "^0x[a-fA-F0-9]{40}$",
        },
        messageSignature: {
          type: "string",
        },
      },
      required: ["address", "messageSignature"],
    },
  },
  handler: async (req) => {
    return { hello: "world" };
  },
};
