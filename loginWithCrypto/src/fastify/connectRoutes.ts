import { FastifyInstance } from "fastify";
import { routes } from "./routes/index.js";
import fastifyPlugin from "fastify-plugin";
import { register } from "./routes/register.js";
import { login } from "./routes/login.js";
export const connectRoutes = fastifyPlugin(
  (fastify: FastifyInstance, opts, done) => {
    fastify.post("/register", { ...register, config: opts });
    fastify.post("/login", { ...login, config: opts });
    done();
  }
);
