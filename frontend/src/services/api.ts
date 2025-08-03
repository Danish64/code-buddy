import type { ApiError, GenerateRequest, GenerateResponse } from "../types";

const BASE_URL = "http://localhost:3000";

export class ApiService {
  static async generateCode(
    request: GenerateRequest
  ): Promise<GenerateResponse | ApiError> {
    try {
      console.log("Check service call", request);
      const response = await fetch(`${BASE_URL}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API Error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }
}
