import Link from "next/link";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-100 pt-24">
        {/* Hero Section */}
        <section className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-blue-600">
              Project LOOP
            </h1>

            <p className="mt-4 text-xl text-gray-700">
              AI Customer Feedback Intelligence Platform
            </p>

            <p className="mt-2 text-gray-500">
              Collect customer feedback, analyze sentiment, and generate
              AI-powered insights.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex justify-center gap-4">
              <Link
                href="/signup"
                className="rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
              >
                Get Started
              </Link>

              <a
                href="#features"
                className="rounded-lg border border-blue-600 px-6 py-3 text-blue-600 transition hover:bg-blue-50"
              >
                Learn More
              </a>
            </div>

            {/* Highlights */}
            <div className="mt-12 flex justify-center gap-10 text-lg text-gray-600">
              <span>🚀 Fast</span>
              <span>🔒 Secure</span>
              <span>🤖 AI Powered</span>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="bg-white px-6 py-16"
        >
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-3xl font-bold text-gray-900">
              LOOP Features
            </h2>

            <p className="mt-3 text-center text-gray-500">
              Manage and understand customer feedback from one platform.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              <Link
                href="/feedback"
                className="rounded-xl border border-gray-200 bg-gray-50 p-6 transition hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="text-xl font-semibold text-gray-900">
                  💬 Customer Feedback
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Collect and review customer feedback in one place.
                </p>
              </Link>

              <Link
                href="/trends"
                className="rounded-xl border border-gray-200 bg-gray-50 p-6 transition hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="text-xl font-semibold text-gray-900">
                  📊 Feedback Trends
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Analyze positive, negative, and neutral feedback trends.
                </p>
              </Link>

              <Link
                href="/ask"
                className="rounded-xl border border-gray-200 bg-gray-50 p-6 transition hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="text-xl font-semibold text-gray-900">
                  🤖 Ask LOOP AI
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Ask questions and get insights from your customer feedback.
                </p>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}