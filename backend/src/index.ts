import { startupFastifyServer } from "./fastify.js";
import "./di.js";

console.log("process", process.env);
startupFastifyServer();
