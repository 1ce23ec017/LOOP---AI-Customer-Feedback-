export default function ReportsPage() {
  return (
    <>
     <h1 className="text-4xl font-bold">Reports</h1>
     
     <p className="text-gray-600 mt-2">
          Generate and download customer feedback reports.
     </p>

     <div className="grid grid-cols-3 gap-6 mt-8">

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold">
              Daily Report
            </h2>

            <p className="text-gray-500 mt-3">
              Download today feedback report.
            </p>

            <button className="mt-5 bg-blue-600 text-white px-5 py-2 rounded-lg">
              Download
            </button>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold">
              Weekly Report
            </h2>

            <p className="text-gray-500 mt-3">
              Download weekly analytics report.
            </p>

            <button className="mt-5 bg-green-600 text-white px-5 py-2 rounded-lg">
              Download
            </button>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold">
              Monthly Report
            </h2>

            <p className="text-gray-500 mt-3">
              Download monthly performance report.
            </p>

            <button className="mt-5 bg-purple-600 text-white px-5 py-2 rounded-lg">
              Download
            </button>
          </div>

        </div>
    </>
  );
}