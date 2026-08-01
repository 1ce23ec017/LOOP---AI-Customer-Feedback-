"use client";

import { useEffect, useState } from "react";
import DashboardCard from "../../../components/DashboardCard";
import FeedbackTable from "../../../components/FeedbackTable";

type Feedback = {
  id: string;
  content: string;
  channel: string;
  customerLabel: string | null;
  sentiment: string | null;
  status: string;
  theme: string | null;
  createdAt: string;
};

export default function DashboardPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const response = await fetch("/api/feedback");

        if (!response.ok) {
          throw new Error("Failed to load dashboard data");
        }

        const data = await response.json();

        setFeedbacks(data);
      } catch (error) {
        console.error("Dashboard data error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const totalFeedback = feedbacks.length;

  const positiveCount = feedbacks.filter(
    (feedback) => feedback.sentiment === "POSITIVE"
  ).length;

  const negativeCount = feedbacks.filter(
    (feedback) => feedback.sentiment === "NEGATIVE"
  ).length;

  const pendingCount = feedbacks.filter(
    (feedback) => feedback.status === "PENDING"
  ).length;

  const stats = [
    {
      title: "Total Feedback",
      value: loading ? "..." : String(totalFeedback),
    },
    {
      title: "Positive",
      value: loading ? "..." : String(positiveCount),
    },
    {
      title: "Negative",
      value: loading ? "..." : String(negativeCount),
    },
    {
      title: "Pending",
      value: loading ? "..." : String(pendingCount),
    },
  ];

  return (
    <>
      <h1 className="text-4xl font-bold">
        Dashboard
      </h1>

      <p className="mt-3 text-gray-600">
        Welcome to Project LOOP Dashboard
      </p>

      {/* Dashboard Cards */}
      <div className="mt-8 grid grid-cols-2 gap-6">
        {stats.map((item) => (
          <DashboardCard
            key={item.title}
            title={item.title}
            value={item.value}
          />
        ))}
      </div>

      <FeedbackTable />
    </>
  );
}