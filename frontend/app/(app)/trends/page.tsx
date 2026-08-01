"use client";

import { useEffect, useState } from "react";

type FeedbackItem = {
    createdAt: string;
    sentiment: string | null;
};

export default function TrendsPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");
  useEffect(() => {
    const loadTrends = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/feedback");

        if (!response.ok) {
          throw new Error("Failed to load feedback trends.");
        }

        const data = await response.json();

        setFeedbacks(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load feedback trends."
        );
      } finally {
        setLoading(false);
      }
    };

    loadTrends();
  }, []);

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    if (timeFilter === "all") {
      return true;
    }

    const days = Number(timeFilter);

    const feedbackDate = new Date(feedback.createdAt);
    const currentDate = new Date();

    const difference =
      currentDate.getTime() - feedbackDate.getTime();

    const differenceInDays =
      difference / (1000 * 60 * 60 * 24);

    return differenceInDays <= days;
  });
  
  const positiveCount = filteredFeedbacks.filter(
    (feedback) => feedback.sentiment === "POSITIVE"
  ).length;

  const negativeCount = filteredFeedbacks.filter(
    (feedback) => feedback.sentiment === "NEGATIVE"
  ).length;

  const neutralCount = filteredFeedbacks.filter(
    (feedback) => feedback.sentiment === "NEUTRAL"
  ).length;

  const monthlyData = filteredFeedbacks.reduce(
    (acc: Record<string, number>, feedback) => {
      const date = new Date(feedback.createdAt);

      const month = date.toLocaleString("en-US", {
        month: "short",
      });

      acc[month] = (acc[month] || 0) + 1;

      return acc;
    },
    {}
  );

  return (
    <>
        {loading && (
          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
            <p className="text-sm font-medium text-blue-700">
              Loading feedback trends...
            </p>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>
        )} 
        <h1 className="text-4xl font-bold">Feedback Trends</h1>

        <p className="text-gray-600 mt-2">
          Analyze customer feedback trends over time.
        </p>

        <div className="mt-6 flex items-center gap-3">
          <label
            htmlFor="timeFilter"
            className="text-sm font-semibold text-gray-700"
          > 
            Time Period:
          </label>

          <select
            id="timeFilter"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="all">All Time</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
          </select>
        </div>

        <div className="mt-8 rounded-xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900">
            Total Feedback
          </h2>

        <p className="mt-2 text-3xl font-bold text-blue-600">
          {filteredFeedbacks.length}
        </p>

        <p className="mt-1 text-sm text-gray-500">
          Customer feedback records available for analysis.
        </p>
      </div>
      
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900">
            Positive
          </h2>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {positiveCount}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Positive feedback
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900">
            Negative
          </h2>

          <p className="mt-2 text-3xl font-bold text-red-600">
            {negativeCount}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Negative feedback
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900">
            Neutral
          </h2>

          <p className="mt-2 text-3xl font-bold text-gray-600">
            {neutralCount}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Neutral feedback
          </p>
        </div>

      </div>  

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-8">
          <div className="bg-white rounded-xl shadow p-6 h-72">
            <h2 className="text-xl font-semibold mb-4">
              Monthly Feedback
            </h2>

            <div className="h-52 flex items-end gap-4">
              {Object.entries(monthlyData).length > 0 ? (
                Object.entries(monthlyData).map(([month, count]) => {
                  const maxCount = Math.max(
                    ...Object.values(monthlyData)
                  );
                  const height = maxCount
                    ? (count / maxCount) * 100
                    : 0;

                  return (
                    <div
                      key={month}
                      className="flex h-full flex-1 flex-col items-center justify-end"
                    >
                      <span className="mb-2 text-xs font-semibold text-gray-600">
                        {count}
                      </span>

                      <div
                        className="w-full rounded-t-lg bg-blue-500"
                        style={{
                          height: `${height}%`,
                          minHeight: count > 0 ? "12px" : "0px",
                        }}
                      />

                      <span className="mt-2 text-xs text-gray-500">
                        {month}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="w-full text-center text-sm text-gray-500">
                  No feedback available for trend analysis.
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 h-72">
            <h2 className="text-xl font-semibold mb-4">
              Sentiment Analysis
            </h2>

            <div className="h-52 flex flex-col justify-center gap-4">

              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium text-green-700">
                    Positive
                  </span>

                  <span className="text-gray-500">
                   {positiveCount}
                  </span>
                </div>

                <div className="h-3 w-full rounded-full bg-gray-100">
                  <div
                    className="h-3 rounded-full bg-green-500"
                    style={{
                      width: `${
                        filteredFeedbacks.length
                          ? (positiveCount / filteredFeedbacks.length) * 100
                          : 0
                      }%`,
                    }}
                  />
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium text-red-700">
                      Negative
                    </span>

                    <span className="text-gray-500">
                      {negativeCount}
                    </span>
                  </div>

                  <div className="h-3 w-full rounded-full bg-gray-100">
                    <div
                      className="h-3 rounded-full bg-red-500"
                      style={{
                        width: `${
                          filteredFeedbacks.length
                            ? (negativeCount / filteredFeedbacks.length) * 100
                            : 0
                        }%`,
                      }}
                    />
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-medium text-gray-700">
                        Neutral
                      </span>

                      <span className="text-gray-500">
                        {neutralCount}
                      </span>
                    </div>

                    <div className="h-3 w-full rounded-full bg-gray-100">
                      <div
                        className="h-3 rounded-full bg-gray-500"
                        style={{
                          width: `${
                            filteredFeedbacks.length
                            ? (neutralCount / filteredFeedbacks.length) * 100
                            : 0
                          }%`,
                        }}
                      />
                      </div>
                    </div>

              </div>
            </div>

      </div>
    </>
  );
}