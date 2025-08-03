import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { generateController } from "../controllers/generate.controller";

export const generateRoutes: FastifyPluginAsync = async (
  fastify: FastifyInstance
) => {
  fastify.post("/generate", generateController);
};
