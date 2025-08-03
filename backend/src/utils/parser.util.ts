import { Format } from "../types";

export function parseInput(
  input: string | object,
  format: Format
): Record<string, string> {
  if (format === "json") {
    const jsonObj = typeof input === "string" ? JSON.parse(input) : input;
    const schema: Record<string, string> = {};

    Object.entries(jsonObj).forEach(([key, value]) => {
      schema[key] = typeof value;
    });

    return schema;
  }

  // Handle TypeScript interface/type format
  const inputStr = typeof input === "string" ? input : JSON.stringify(input);
  const objectStr = inputStr
    .replace(/interface\s+\w+\s*{/, "")
    .replace(/type\s+\w+\s*=\s*{/, "")
    .replace(/}$/, "")
    .trim();

  const entries = objectStr
    .split(";")
    .filter(Boolean)
    .map((line) => {
      const [key, type] = line.trim().split(":");
      return [key.trim(), type.trim()];
    });

  const obj: Record<string, string> = {};
  entries.forEach(([key, type]) => {
    if (key && type) {
      obj[key] = type;
    }
  });

  return obj;
}
