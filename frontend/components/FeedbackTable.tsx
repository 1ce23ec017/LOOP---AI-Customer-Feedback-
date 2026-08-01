"use client";

import { useEffect, useState } from "react";

type Feedback = {
  id: string;
  content: string;
  customerLabel: string | null;
  sentiment: string | null;
  status: string;
  createdAt: string;
};

export default function FeedbackTable() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        const response = await fetch("/api/feedback");

        if (!response.ok) {
          throw new Error("Failed to load feedback.");
        }

        const data = await response.json();

        setFeedbacks(data.slice(0, 5));
      } catch (error) {
        console.error("Feedback table error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFeedbacks();
  }, []);

  return (
    <div className="mt-10 rounded-xl bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-bold">
        Recent Feedback
      </h2>

      {loading ? (
        <p className="py-6 text-center text-gray-500">
          Loading feedback...
        </p>
      ) : feedbacks.length === 0 ? (
        <p className="py-6 text-center text-gray-500">
          No feedback found.
        </p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Feedback</th>
              <th className="p-3 text-left">Sentiment</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {feedbacks.map((feedback) => (
              <tr key={feedback.id} className="border-b">
                <td className="p-3">
                  {feedback.customerLabel || "Unknown"}
                </td>

                <td className="max-w-md p-3">
                  {feedback.content}
                </td>

                <td
                  className={`p-3 ${
                    feedback.sentiment === "POSITIVE"
                      ? "text-green-600"
                      : feedback.sentiment === "NEGATIVE"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {feedback.sentiment || "Not analyzed"}
                </td>

                <td className="p-3">
                  {feedback.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}