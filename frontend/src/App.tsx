import { useState } from "react";
import { CodeBlock } from "./components/CodeBlock";
import { ErrorMessage } from "./components/ErrorMessage";
import { FormatToggle } from "./components/FormatToggle";
import { InputEditor } from "./components/InputEditor";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { ApiService } from "./services/api";
import type { ApiError, Format, GenerateResponse } from "./types/index";

function App() {
  const [format, setFormat] = useState<Format>("json");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!input.trim()) {
      setError("Please provide input data");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let parsedInput: string | object = input;

      // If format is JSON, try to parse it
      if (format === "json") {
        try {
          parsedInput = JSON.parse(input);
        } catch (parseError) {
          setError("Invalid JSON format. Please check your input.");
          setLoading(false);
          return;
        }
      }

      const response = await ApiService.generateCode({
        input: parsedInput,
        format,
      });

      if (response.success) {
        setResult(response as GenerateResponse);
      } else {
        setError((response as ApiError).error);
      }
    } catch (err) {
      setError("Failed to generate code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormatChange = (newFormat: Format) => {
    setFormat(newFormat);
    setInput("");
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Code Generator
          </h1>
          <p className="text-lg text-gray-600">
            Generate SQL, models, routes, and services from your data structure
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Input</h2>

            <FormatToggle format={format} onChange={handleFormatChange} />

            <InputEditor value={input} onChange={setInput} format={format} />

            <button
              onClick={handleGenerate}
              disabled={loading || !input.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              {loading ? "Generating..." : "Generate Code"}
            </button>
          </div>

          {/* Output Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Generated Code
            </h2>

            {loading && <LoadingSpinner />}

            {error && <ErrorMessage message={error} />}

            {result && (
              <div className="space-y-6">
                <CodeBlock
                  title="SQL Schema"
                  code={result.sql}
                  language="sql"
                />

                <CodeBlock
                  title="Model"
                  code={result.model}
                  language="javascript"
                />

                <CodeBlock
                  title="Routes"
                  code={result.routes}
                  language="javascript"
                />

                <CodeBlock
                  title="Service"
                  code={result.service}
                  language="javascript"
                />
              </div>
            )}

            {!loading && !result && !error && (
              <div className="text-center py-12 text-gray-500">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
                <p>
                  Enter your data structure and click "Generate Code" to see the
                  results
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
