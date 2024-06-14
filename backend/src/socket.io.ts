import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { Server, ServerOptions } from "socket.io";
import { IUser } from "./services/user/types.js";

const fastifySocketIO: FastifyPluginAsync<Partial<ServerOptions>> = fp(
  async function (fastify, opts) {
    const server = new Server<
      {},
      {
        user: () => void;
      }
    >({
      cors: {
        origin: "*",
      },
    });

    server.listen(Number(process.env.WS_PORT) || 5175);

    fastify.decorate("io", server);

    fastify.addHook("onClose", (fastify: FastifyInstance, done) => {
      (fastify as any).io.close();
      done();
    });
  },
  { fastify: ">=4.x.x", name: "fastify-socket.io" }
);

declare module "fastify" {
  interface FastifyInstance {
    io: Server<
      {},
      {
        user: (data: IUser) => void;
        event: (data: any) => void;
      }
    >;
  }
}

export default fastifySocketIO;
