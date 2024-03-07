import Fastify from "fastify";
import { connectToDatabase } from "./db.js";
import { startupFastifyServer } from "./fastify.js";

import jwt from "jsonwebtoken";

import { TaskExecutor } from "@golem-sdk/golem-js";

await connectToDatabase();
await startupFastifyServer();
