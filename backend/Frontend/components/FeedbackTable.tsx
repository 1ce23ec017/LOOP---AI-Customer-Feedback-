export default function FeedbackTable() {
  return (
    <div className="mt-10 bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">
        Recent Feedback
      </h2>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">Customer</th>
            <th className="p-3 text-left">Rating</th>
            <th className="p-3 text-left">Sentiment</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          <tr className="border-b">
            <td className="p-3">John</td>
            <td className="p-3">⭐⭐⭐⭐⭐</td>
            <td className="p-3 text-green-600">Positive</td>
            <td className="p-3">Reviewed</td>
          </tr>

          <tr className="border-b">
            <td className="p-3">Sarah</td>
            <td className="p-3">⭐⭐⭐</td>
            <td className="p-3 text-yellow-600">Neutral</td>
            <td className="p-3">Pending</td>
          </tr>

          <tr>
            <td className="p-3">David</td>
            <td className="p-3">⭐⭐</td>
            <td className="p-3 text-red-600">Negative</td>
            <td className="p-3">Open</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}