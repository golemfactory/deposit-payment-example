import { RouteOptions } from "fastify";

export const me: RouteOptions = {
  method: "POST",
  url: "/me",
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
