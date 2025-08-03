import type { Format } from "../types";

interface FormatToggleProps {
  format: Format;
  onChange: (format: Format) => void;
}

export const FormatToggle = ({ format, onChange }: FormatToggleProps) => {
  return (
    <div className="flex items-center space-x-4 mb-4">
      <span className="text-sm font-medium text-gray-700">Input Format:</span>
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          type="button"
          onClick={() => onChange("json")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            format === "json"
              ? "bg-blue-500 text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          JSON
        </button>
        <button
          type="button"
          onClick={() => onChange("type")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            format === "type"
              ? "bg-blue-500 text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          TypeScript
        </button>
      </div>
    </div>
  );
};
