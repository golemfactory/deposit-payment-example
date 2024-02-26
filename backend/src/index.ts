import Fastify from "fastify";
import { connectToDatabase } from "./db.js";

const fastify = Fastify({
  logger: true,
});

await connectToDatabase();

fastify.get("/", function (request, reply) {
  reply.send({ hello: "world" });
});

fastify.listen({ port: Number(process.env.PORT) }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
