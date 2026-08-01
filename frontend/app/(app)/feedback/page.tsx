"use client";
import { useEffect, useState } from "react";
type Feedback = {
  id: string;
  content: string;
  channel: string;
  customerLabel: string | null;
  sentiment: string;
  status: string;
  theme: string | null;
  createdAt: string;  
};
export default function FeedbackPage() {
  const [content, setContent] = useState("");
  const [channel, setChannel] = useState("web");
  const [customerLabel, setCustomerLabel] = useState("");
  const [message, setMessage] = useState("");
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  useEffect(() => {
    const fetchFeedbacks = async () => {
      const response = await fetch("/api/feedback");

      if (!response.ok) {
        console.error("Failed to fetch feedbacks");
          return;
      }

      const data = await response.json();

      setFeedbacks(data);
    };

    fetchFeedbacks();
  }, []);
  const submitFeedback = async () => {
    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        channel,
        customerLabel,
        sentiment: "POSITIVE",
        status: "REVIEWED",
        theme: "Customer Support",
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      setMessage("Feedback submitted successfully!");

      const feedbackResponse = await fetch("/api/feedback");

      if (feedbackResponse.ok) {
        const feedbackData = await feedbackResponse.json();
        setFeedbacks(feedbackData);
      }
    } else {
      setMessage(data.error || "Failed to submit feedback");
    }

    console.log(data);
  };
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Customer Feedback
        </h1>

        <p className="mt-2 text-gray-500">
          Collect and review customer feedback in one place.
        </p>
      </div>
    
    <div className="max-w-3xl rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
      <h2 className="mb-5 text-xl font-semibold text-gray-900">
        Add New Feedback
      </h2>
      
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write customer feedback here..."
        className="mt-2 w-full rounded-xl border border-gray-300 p-4 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        rows={5}
      />

      <input
        type="text"
        value={customerLabel}
        onChange={(e) => setCustomerLabel(e.target.value)}
        placeholder="Enter Customer name or label"
        className="mt-4 w-full rounded-xl border border-gray-300 p-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

      <select
        value={channel}
        onChange={(e) => setChannel(e.target.value)}
        className="mt-4 w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        <option value="web">Web</option>
        <option value="email">Email</option>
        <option value="google">Google</option>
      </select>
    </div>

      <div className="mt-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">
          Recent Feedback
        </h2>

        {feedbacks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
            <p className="text-base font-medium text-gray-700">
              No feedback found
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Customer feedback will appear here once it is submitted.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {feedbacks.map((feedback) => (
          <div
            key={feedback.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <p className="text-base font-medium leading-6 text-gray-900">
                {feedback.content}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  Customer: {feedback.customerLabel || "Unknown"}
                </span>

                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  Channel: {feedback.channel}
                </span>

                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                  Sentiment: {feedback.sentiment}
                </span>

                <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
                  Status: {feedback.status}
                </span>
              </div>
              <p className="mt-3 text-xs text-gray-400">
                Theme: {feedback.theme || "General"}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                {new Date(feedback.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={submitFeedback}
        className="mt-5 w-full rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
      >
        Submit Feedback
      </button>
      {message && (
        <div className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {message}
        </div>
      )}
    </div>
  );
}