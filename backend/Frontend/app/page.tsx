import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
     <Navbar />
    <main className="min-h-screen flex items-center justify-center bg-gray-100 pt-24">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-blue-600">
          Project LOOP
        </h1>

        <p className="mt-4 text-xl text-gray-700">
          AI Customer Feedback Intelligence Platform
        </p>

        <p className="mt-2 text-gray-500">
          Collect customer feedback, analyze sentiment, and generate AI-powered insights.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            Get Started
          </button>
          <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition">
            Learn More
          </button>    
        </div>
        <div className="mt-12 flex justify-center gap-10 text-gray-600 text-lg">
          <span>🚀 Fast</span>
          <span>🔒 Secure</span>
          <span>🤖 AI Powered</span>
        </div>
      </div>
    </main>
    </>
  );
}