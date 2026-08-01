"use client";

import { useState } from "react";

export default function AskPage() {
  const quickQuestions = [
    "What are customers saying about our support?",
    "What are the most common complaints?",
    "What are customers liking the most?",
    "What issues should we focus on first?",
  ];
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <>
        <h1 className="text-4xl font-bold">
          Ask LOOP AI
        </h1>

        <p className="text-gray-600 mt-2">
          Ask any question about customer feedback.
        </p>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <label className="text-sm font-semibold text-gray-800">
            Ask your question
          </label>

          <p className="mt-1 text-sm text-gray-500">
            Ask LOOP AI anything about your customer feedback.
          </p>

          <textarea
            placeholder="Example: What are customers saying about our support?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="mt-5 h-40 w-full resize-none rounded-xl border border-gray-300 p-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <div className="mt-4">
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Suggested Questions
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Try one of these questions to explore your customer feedback.
              </p>
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {quickQuestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setQuestion(item);
                    setError("");
                  }}
                  className="rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">

            <p className="text-xs text-gray-400">
              LOOP AI will analyze your feedback data.
            </p>

            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                if (!question.trim()) {
                  setError("Please type a question first.");
                  return;
                }

                setError("");
                setLoading(true);

                try {
                  const response = await fetch("/api/ask", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      question,
                    }),
                  });

                  const data = await response.json();

                  if (!response.ok) {
                    throw new Error(data.error || "Something went wrong.");
                  }

                  setAnswer(data.answer);

                  setQuestion("");
                } catch (error) {
                  setError(
                    error instanceof Error
                      ? error.message
                      : "Failed to process your question."
                  );
                } finally {
                  setLoading(false);
                }
              }}
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
             {loading ? "Analyzing..." : "Ask AI"}
            </button>

            <button
              type="button"
              onClick={() => {
                setQuestion("");
                setAnswer("");
                setError("");
              }}
              disabled={loading}
              className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear
            </button>
          </div>
          
          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm font-medium text-red-700">
                {error}
              </p>
            </div>
          )}

          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-900">
                AI Answer
              </h2>

              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                LOOP AI
              </span>
            </div>

            <div className="mt-3 rounded-xl bg-gray-50 p-5">
              {answer ? (
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Based on your question:
                  </p>

                  <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-gray-700">
                    {answer}
                  </div>
                </div>
              ) : (
                <p className="text-sm leading-6 text-gray-500">
                  Ask a question to get an AI-powered insight from your customer feedback.
                </p>
              )}
            </div>
          </div>

        </div>
    </>
  );
}