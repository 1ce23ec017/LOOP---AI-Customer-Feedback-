export default function TrendsPage() {
  return (
    <>
        <h1 className="text-4xl font-bold">Feedback Trends</h1>

        <p className="text-gray-600 mt-2">
          Analyze customer feedback trends over time.
        </p>

        <div className="grid grid-cols-2 gap-6 mt-8">

          <div className="bg-white rounded-xl shadow p-6 h-72">
            <h2 className="text-xl font-semibold mb-4">
              Monthly Feedback
            </h2>

            <div className="h-52 flex items-center justify-center text-gray-400">
              📊 Line Chart Coming Soon
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 h-72">
            <h2 className="text-xl font-semibold mb-4">
              Sentiment Analysis
            </h2>

            <div className="h-52 flex items-center justify-center text-gray-400">
              🥧 Pie Chart Coming Soon
            </div>
          </div>

        </div>
    </>
  );
}