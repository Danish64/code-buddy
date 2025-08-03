import Fastify from "fastify";
import { generateRoutes } from "./routes/generate.route";

export const buildApp = () => {
  const app = Fastify({ logger: true });

  // Register routes
  app.register(generateRoutes, { prefix: "/api" });

  return app;
};
