import { Format } from "../types";
import {
  generateModel,
  generateRoutes,
  generateService,
  generateSQL,
} from "../utils/generator.util";
import { parseInput } from "../utils/parser.util";

export const generatorService = {
  generate: async (requestBody: { input: string | object; format: Format }) => {
    console.log("Check service running ... ", requestBody);
    const { input, format } = requestBody;
    const parsed = parseInput(input, format);

    return {
      success: true,
      sql: generateSQL(parsed),
      model: generateModel(parsed),
      routes: generateRoutes(),
      service: generateService(parsed),
    };
  },
};
