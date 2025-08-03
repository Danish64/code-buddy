export interface GenerateRequest {
  input: string | object;
  format: Format;
}

export interface GenerateResponse {
  sql: string;
  model: string;
  routes: string;
  service: string;
  success: boolean;
}

export type Format = "json" | "type";

export interface GenerateInput {
  input: string | object;
  format: Format;
}

export interface ApiError {
  success: false;
  error: string;
}
