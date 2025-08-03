import { FastifyReply, FastifyRequest } from "fastify";
import { generatorService } from "../services/generator.service";
import { GenerateRequest } from "../types";

export const generateController = async (
  request: FastifyRequest<{ Body: GenerateRequest }>,
  reply: FastifyReply
) => {
  try {
    const { input, format } = request.body;

    if (!input || !format) {
      return reply.status(400).send({
        success: false,
        error: "Missing required fields: input and format",
      });
    }

    if (!["json", "type"].includes(format)) {
      return reply.status(400).send({
        success: false,
        error: 'Format must be either "json" or "type"',
      });
    }

    const result = await generatorService.generate({ input, format });
    reply.send(result);
  } catch (error) {
    reply.status(500).send({
      success: false,
      error: error instanceof Error ? error.message : "Generation failed",
    });
  }
};
