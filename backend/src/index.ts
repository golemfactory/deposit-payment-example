import Fastify from "fastify";
import { connectToDatabase } from "./db.js";
import { startupFastifyServer } from "./fastify.js";

import jwt from "jsonwebtoken";

console.log(jwt.sign({ a: 12 }, "secret", { expiresIn: "1h" }));
console.log(jwt.sign({ a: 12 }, "secret", { expiresIn: "2h" }));

await connectToDatabase();
await startupFastifyServer();
