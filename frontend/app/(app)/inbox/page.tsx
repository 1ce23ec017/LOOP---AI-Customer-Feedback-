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

export default function InboxPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState("all");
  const [sentimentFilter, setSentimentFilter] = useState("all");
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  
  useEffect(() => {
    const fetchFeedbacks = async () => {
      const response = await fetch("/api/feedback");

      if (!response.ok) {
        console.error("Failed to fetch feedbacks");
        setLoading(false);
        return;
      }

      const data = await response.json();

      setFeedbacks(data);
      setLoading(false);
    };

    fetchFeedbacks();
  }, []);
  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      feedback.content.toLowerCase().includes(searchText) ||
      (feedback.customerLabel || "").toLowerCase().includes(searchText) ||
      feedback.channel.toLowerCase().includes(searchText) ||
      feedback.sentiment.toLowerCase().includes(searchText) ||
      feedback.status.toLowerCase().includes(searchText) ||
      (feedback.theme || "").toLowerCase().includes(searchText);

    const matchesChannel =
      channelFilter === "all" ||
      feedback.channel.toLowerCase() === channelFilter;
    
    const matchesSentiment =
      sentimentFilter === "all" ||
      feedback.sentiment.toLowerCase() === sentimentFilter;
    
      return matchesSearch && matchesChannel && matchesSentiment;
  });
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-gray-900">
        Inbox
      </h1>

      <p className="mt-2 text-gray-500">
        Customer feedback messages will appear here.
      </p>
      
      <div className="mt-4">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
          {filteredFeedbacks.length}{" "}
          {filteredFeedbacks.length === 1 ? "message" : "messages"}
        </span>
      </div>

      <div className="mt-6 max-w-4xl">
        <p className="mb-3 text-sm font-semibold text-gray-700">
          Search & Filters
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search feedback or customer..."
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="rounded-xl border border-gray-300 bg-white p-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="all">All Channels</option>
            <option value="web">Web</option>
            <option value="email">Email</option>
            <option value="google">Google</option>
          </select>

          <select
            value={sentimentFilter}
            onChange={(e) => setSentimentFilter(e.target.value)}
            className="rounded-xl border border-gray-300 bg-white p-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="all">All Sentiments</option>
            <option value="positive">Positive</option>
            <option value="negative">Negative</option>
            <option value="neutral">Neutral</option>
          </select>

          <button
            type="button"
            disabled={!search && channelFilter === "all" && sentimentFilter === "all"}
            onClick={() => {
              setSearch("");
              setChannelFilter("all");
              setSentimentFilter("all");
            }}
            className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
              search || channelFilter !== "all" || sentimentFilter !== "all"
                ? "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                : "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
            }`}
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(300px,1fr)]">
        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-sm text-gray-500">
              Loading messages...
            </p>
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
            <p className="font-medium text-gray-700">
              No messages found
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Customer feedback messages will appear here.
            </p>
          </div>
        ) : filteredFeedbacks.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-base font-semibold text-gray-700">
              No feedback found
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or filters.
            </p>
          </div>       
        ) : (
          <div className="grid min-w-0 grid-cols-1 gap-4">
            {filteredFeedbacks.map((feedback) => (
              <div
                key={feedback.id}
                onClick={() => setSelectedFeedback(feedback)}
                className={`cursor-pointer rounded-2xl border p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md ${
                  selectedFeedback?.id === feedback.id
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 bg-white"
                }`}
              >
                {selectedFeedback?.id === feedback.id && (
                  <div className="mb-3 text-right">
                    <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                      Selected
                    </span>
                  </div>
                )}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-900">
                    {feedback.customerLabel || "Unknown Customer"}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {feedback.channel}
                  </p>
                </div>

                <div className="text-right">
                  <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
                    {feedback.status}
                  </span>

                  <p className="mt-2 text-xs text-gray-400">
                    {new Date(feedback.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <p className="mt-4 line-clamp-2 text-base font-medium leading-6 text-gray-900">
                {feedback.content}
              </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    Customer: {feedback.customerLabel || "Unknown"}
                  </span>

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    Channel: {feedback.channel}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      feedback.sentiment === "POSITIVE"
                        ? "bg-green-50 text-green-700"
                        : feedback.sentiment === "NEGATIVE"
                          ? "bg-red-50 text-red-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    Sentiment: {feedback.sentiment}
                  </span>

                  <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
                    Status: {feedback.status}
                  </span>

                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
                    Theme: {feedback.theme || "General"}
                  </span>

                  <div className="mt-5 flex justify-end">
                    <span className="text-sm font-semibold text-blue-600">
                      View Details →
                    </span>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
        {selectedFeedback && (
          <div className="h-fit min-w-0 rounded-2xl border border-blue-200 bg-blue-50 p-6 lg:sticky lg:top-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  Selected Feedback
                </p>

                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  Feedback Details
                </h2>

                <div className="mt-3 rounded-xl bg-white/70 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Customer
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {selectedFeedback.customerLabel || "Unknown Customer"}
                  </p>
                </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedFeedback(null)}
              className="shrink-0 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
            >
              Close
            </button>
          </div>        

            <div className="mt-5 space-y-3">
              <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Customer Feedback
                </p>

                <p className="mt-2 leading-6 text-gray-800">
                  {selectedFeedback.content}
                </p>
              </div>

              <div className=" flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm">
                <span className="font-semibold text-gray-600">
                  Channel
                </span>

                <span className="rounded-full bg-blue-50 px-3 py-1 font-medium capitalize text-gray-700">
                  {selectedFeedback.channel}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="rounded-xl border border-gray-200 bg-white p-3">
                  <p className="text-xs font-semibold text-gray-400">
                    Sentiment
                  </p>

                  <span
                    className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      selectedFeedback.sentiment === "POSITIVE"
                        ? "bg-green-100 text-green-700"
                        : selectedFeedback.sentiment === "NEGATIVE"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {selectedFeedback.sentiment}
                  </span>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-3">
                  <p className="text-xs font-semibold text-gray-400">
                    Status
                  </p>

                  <span className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    {selectedFeedback.status}
                  </span>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-3">
                  <p className="text-xs font-semibold text-gray-400">
                    Theme
                  </p>

                  <span className="mt-2 inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                    {selectedFeedback.theme || "General"}
                  </span>
                </div>
              </div>
              
              <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                <p className="text-xs font-semibold text-gray-400">
                  Feedback ID
                </p>

                <p className="mt-1 break-all text-xs font-medium text-gray-700">
                  {selectedFeedback.id}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                <p className="text-xs font-semibold text-gray-400">
                  Created
                </p>

                <p className="mt-1 text-sm font-medium text-gray-700">
                  {new Date(selectedFeedback.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}