"use client";
import { useState } from "react";
export default function FeedbackPage() {
  const [content, setContent] = useState("");
  const [channel, setChannel] = useState("web");
  const [customerLabel, setCustomerLabel] = useState("");
  const [message, setMessage] = useState("");
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
    } else {
       setMessage(data.error || "Failed to submit feedback");
    }

    console.log(data);
  };
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">
        Feedback Page
      </h1>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter customer feedback..."
        className="mt-6 w-full max-w-2xl border rounded-lg p-4"
        rows={5}
      />

      <input
        type="text"
        value={customerLabel}
        onChange={(e) => setCustomerLabel(e.target.value)}
        placeholder="Customer name or label"
        className="mt-4 w-full max-w-2xl border rounded-lg p-3"
      />

      <select
        value={channel}
        onChange={(e) => setChannel(e.target.value)}
        className="mt-4 w-full max-w-2xl border rounded-lg p-3"
      >
        <option value="web">Web</option>
        <option value="email">Email</option>
        <option value="google">Google</option>
      </select>
      <button
        type="button"
        onClick={submitFeedback}
        className="mt-4 rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
      >
        Submit Feedback
      </button>
      {message && (
        <p className="mt-4 text-sm font-medium">
          {message}
        </p>
      )}
    </div>
  );
}