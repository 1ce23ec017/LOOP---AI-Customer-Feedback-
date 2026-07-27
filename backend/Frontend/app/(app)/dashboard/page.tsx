import DashboardCard from "../../../components/DashboardCard";
import FeedbackTable from "../../../components/FeedbackTable";

export default function DashboardPage() {
   const stats = [
   {
      title: "Total Feedback",
      value: "1200",
    },
    {
      title: "Positive",
      value: "980",
    },
    {
      title: "Negative",
      value: "180",
    },
    {
      title: "Pending",
      value: "40",
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
        <div className="grid grid-cols-2 gap-6 mt-8">
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