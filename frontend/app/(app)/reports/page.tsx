"use client";

import { useState } from "react";
import { saveAs } from "file-saver";

export default function ReportsPage() {
  const [reportType, setReportType] = useState("daily");
  const [loading, setLoading] = useState(false);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [reportMessage, setReportMessage] = useState("");

  const downloadReport = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/reports?type=${reportType}`);

      if (!response.ok) {
        throw new Error("Failed to fetch feedback.");
      }

      const feedbacks = await response.json();

      setFeedbackCount(feedbacks.length);

      if (!feedbacks.length) {
        setReportMessage("No feedback available for this report.");
        return;
      }

      setReportMessage(
        `${feedbacks.length} feedback records found for this report.`
      );

      const headers = [
        "Customer",
        "Channel",
        "Sentiment",
        "Status",
        "Theme",
        "Feedback",
        "Created At",
      ];

      const rows = feedbacks.map(
        (feedback: {
          customerLabel?: string | null;
          channel?: string | null;
          sentiment?: string | null;
          status?: string | null;
          theme?: string | null;
          content?: string | null;
          createdAt?: string | null;
        }) => [
        feedback.customerLabel || "Unknown",
        feedback.channel || "",
        feedback.sentiment || "",
        feedback.status || "",
        feedback.theme || "",
        feedback.content || "",
        feedback.createdAt
          ? new Date(feedback.createdAt).toLocaleString()
          : "",
      ]);

      const csvContent = [
        headers,
        ...rows,
      ]
        .map((row) =>
          row
            .map((value: string) =>
              `"${String(value).replace(/"/g, '""')}"`
            )
            .join(",")
        )
        .join("\n");

      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });

      saveAs(
        blob,
        `loop-${reportType}-report.csv`
      );
    } catch (error) {
      console.error("Report download error:", error);
      alert("Failed to download report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
     <h1 className="text-4xl font-bold">Reports</h1>
     
     <p className="text-gray-600 mt-2">
          Generate and download customer feedback reports.
     </p>

     <div className="grid grid-cols-3 gap-6 mt-8">

          <div
            onClick={() => {
              setReportType("daily");
              setFeedbackCount(0);
              setReportMessage("");
            }}
            className={`cursor-pointer rounded-xl border p-6 shadow-sm transition ${
              reportType === "daily"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-white hover:border-blue-300"
            }`}
          >
            <h2 className="text-xl font-semibold">
              Daily Report
            </h2>

            <p className="text-gray-500 mt-3">
              Download today feedback report.
            </p>

            <button
              type="button"
              disabled={loading}
              onClick={downloadReport}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && reportType === "daily" ? "Preparing..." : "Download"}
            </button>
          </div>

          <div
            onClick={() => {
              setReportType("weekly");
              setFeedbackCount(0);
              setReportMessage("");
            }}
            className={`cursor-pointer rounded-xl border p-6 shadow-sm transition ${
              reportType === "weekly"
                ? "border-green-500 bg-green-50"
                : "border-gray-200 bg-white hover:border-green-300"
            }`}
          >
            <h2 className="text-xl font-semibold">
              Weekly Report
            </h2>

            <p className="text-gray-500 mt-3">
              Download weekly analytics report.
            </p>

            <button
              type="button"
              disabled={loading}
              onClick={downloadReport}
              className="mt-5 rounded-lg bg-green-600 px-5 py-2 text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && reportType === "weekly" ? "Preparing..." : "Download"}
            </button>
          </div>

          <div
            onClick={() => {
              setReportType("monthly");
              setFeedbackCount(0);
              setReportMessage("");
            }}
            className={`cursor-pointer rounded-xl border p-6 shadow-sm transition ${
              reportType === "monthly"
                ? "border-purple-500 bg-purple-50"
                : "border-gray-200 bg-white hover:border-purple-300"
            }`}
          >
            <h2 className="text-xl font-semibold">
              Monthly Report
            </h2>

            <p className="text-gray-500 mt-3">
              Download monthly performance report.
            </p>

            <button
              type="button"
              disabled={loading}
              onClick={downloadReport}
              className="mt-5 rounded-lg bg-purple-600 px-5 py-2 text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && reportType === "monthly" ? "Preparing..." : "Download"}
            </button>
          </div>
        </div>
      
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Report Summary
          </h2>

          <div className="mt-4 flex items-center gap-6">
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {feedbackCount}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Feedback records
              </p>
            </div>

          <div className="h-10 w-px bg-gray-200" />

          <div>
            <p className="text-sm font-medium capitalize text-gray-800">
              {reportType} Report
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {reportType === "daily"
                ? "Today"
                : reportType === "weekly"
                ? "Last 7 days"
                : "Last 30 days"}
            </p>
          </div>
        </div>

        {reportMessage && (
          <div className="mt-5 rounded-xl bg-gray-50 px-4 py-3">
            <p className="text-sm text-gray-600">
              {reportMessage}
            </p>
          </div>
        )}
      </div>
    </>
  );
}