import type { Format } from "../types";

interface InputEditorProps {
  value: string;
  onChange: (value: string) => void;
  format: Format;
}

export const InputEditor = ({ value, onChange, format }: InputEditorProps) => {
  const placeholder =
    format === "json"
      ? `{
  "id": 1,
  "title": "Frontend Developer",
  "description": "Develop and maintain user interfaces",
  "requirements": "3+ years experience",
  "location": "Dubai, UAE",
  "department": "Engineering",
  "status": "open",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}`
      : `id: number;
title: string;
description: string;
requirements: string;
location: string;
department: string;
status: string;
created_at: string;
updated_at: string;`;

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {format === "json" ? "JSON Input" : "TypeScript Interface"}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        spellCheck={false}
      />
    </div>
  );
};
