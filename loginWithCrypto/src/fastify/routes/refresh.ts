import { RouteOptions } from "fastify";

export const refresh: RouteOptions = {
  method: "POST",
  url: "/refresh-token",
  schema: {
    body: {
      properties: {
        token: {
          type: "string",
        },
      },
    },
  },
  handler: async () => {
    return { hello: "world" };
  },
};
