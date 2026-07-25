export default function AskPage() {
  return (
    <>
        <h1 className="text-4xl font-bold">
          Ask LOOP AI
        </h1>

        <p className="text-gray-600 mt-2">
          Ask any question about customer feedback.
        </p>

        <div className="mt-8 bg-white rounded-xl shadow p-6">

          <textarea
            placeholder="Type your question..."
            className="w-full border rounded-lg p-4 h-40 resize-none"
          />

          <button
            className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Ask AI
          </button>

        </div>
    </>
  );
}