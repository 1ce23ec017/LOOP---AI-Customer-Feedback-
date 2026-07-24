import DashboardCard from "../../../components/DashboardCard";
import FeedbackTable from "../../../components/FeedbackTable";

export default function DashboardPage() {
  return (
      <>
        <h1 className="text-4xl font-bold">
          Dashboard
        </h1>

        <p className="mt-3 text-gray-600">
          Welcome to Project LOOP Dashboard
        </p>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-2 gap-6 mt-8">
          <DashboardCard
            title="Total Feedback"
            value="1200"
          />

          <DashboardCard
            title="Positive"
            value="980"
          />

          <DashboardCard
            title="Negative"
            value="180"
          />

          <DashboardCard
            title="Pending"
            value="40"
          />
        </div>
        <FeedbackTable />
      </>
  );
}