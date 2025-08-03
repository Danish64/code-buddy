import Fastify from "fastify";
import { generateRoutes } from "./routes/generate.route";

export const buildApp = async () => {
  const app = Fastify({ logger: true });

  // Add CORS headers manually
  app.addHook("preHandler", async (request, reply) => {
    reply.header("Access-Control-Allow-Origin", "*");
    reply.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    reply.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // Handle preflight requests
    if (request.method === "OPTIONS") {
      reply.status(200).send();
      return;
    }
  });

  // Register routes
  await app.register(generateRoutes, { prefix: "/api" });

  return app;
};
