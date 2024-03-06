import { FastifyInstance } from "fastify";
import { routes } from "./routes/index.js";
import fastifyPlugin from "fastify-plugin";

export const connectRoutes = fastifyPlugin(
  (fastify: FastifyInstance, opts, done) => {
    routes.forEach(fastify.route.bind(fastify));
    done();
  }
);
