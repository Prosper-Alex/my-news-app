"use client";

import { useState } from "react";
import type { ClassificationResult } from "@/lib/keyword-classifier";
import { useClassifier } from "@/hooks/use-classifier";

/**
 * Example component demonstrating intent classification and topic routing
 */
export function ClassifierExample() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const { classify, loading } = useClassifier();

  const handleClassify = async () => {
    if (!input.trim()) return;
    const classificationResult = await classify(input);
    setResult(classificationResult);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold">News Query Classifier</h2>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Enter your query:</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleClassify()}
          placeholder="e.g., What is happening in Nigeria today?"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handleClassify}
        disabled={loading || !input.trim()}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
        {loading ? "Classifying..." : "Classify"}
      </button>

      {result && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-4">Results:</h3>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-600">Category:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  {result.category}
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600">Topics:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {result.topics.map((topic: string) => (
                  <span
                    key={topic}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <pre className="mt-4 p-3 bg-white rounded border border-gray-200 text-xs overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
