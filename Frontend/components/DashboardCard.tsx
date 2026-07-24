type DashboardCardProps = {
  title: string;
  value: string;
};

export default function DashboardCard({
  title,
  value,
}: DashboardCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border">
      <h3 className="text-gray-500 text-lg">{title}</h3>

      <p className="text-3xl font-bold mt-2 text-blue-600">
        {value}
      </p>
    </div>
  );
}