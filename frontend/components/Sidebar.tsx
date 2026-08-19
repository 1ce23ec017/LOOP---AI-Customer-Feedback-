"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function Sidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut({
      redirect: false,
    });

    window.location.href = "/login";
  };

  return (
    <aside className="w-64 h-screen bg-slate-900 text-white p-6">
      <h2 className="text-2xl font-bold mb-8">
        LOOP AI
      </h2>

      <ul className="space-y-4">

        {/* Home */}
        <li>
          <Link
            href="/"
            className={`block p-2 rounded cursor-pointer ${
              pathname === "/"
                ? "bg-blue-600"
                : "hover:bg-slate-700"
            }`}
          >
            🏠 Home
          </Link>
        </li>

        {/* Dashboard */}
        <li>
          <Link
            href="/dashboard"
            className={`block p-2 rounded cursor-pointer ${
              pathname === "/dashboard"
                ? "bg-blue-600"
                : "hover:bg-slate-700"
            }`}
          >
            📊 Dashboard
          </Link>
        </li>

        {/* Inbox */}
        <li>
          <Link
            href="/inbox"
            className={`block p-2 rounded cursor-pointer ${
              pathname === "/inbox"
                ? "bg-blue-600"
                : "hover:bg-slate-700"
            }`}
          >
            📥 Inbox
          </Link>
        </li>

        {/* Feedback */}
        <li>
          <Link
            href="/feedback"
            className={`block p-2 rounded cursor-pointer ${
              pathname === "/feedback"
                ? "bg-blue-600"
                : "hover:bg-slate-700"
            }`}
          >
            💬 Feedback
          </Link>
        </li>

        {/* Ask AI */}
        <li>
          <Link
            href="/ask"
            className={`block p-2 rounded cursor-pointer ${
              pathname === "/ask"
                ? "bg-blue-600"
                : "hover:bg-slate-700"
            }`}
          >
            🤖 Ask AI
          </Link>
        </li>

        {/* Trends */}
        <li>
          <Link
            href="/trends"
            className={`block p-2 rounded cursor-pointer ${
              pathname === "/trends"
                ? "bg-blue-600"
                : "hover:bg-slate-700"
            }`}
          >
            📈 Trends
          </Link>
        </li>

        {/* Reports */}
        <li>
          <Link
            href="/reports"
            className={`block p-2 rounded cursor-pointer ${
              pathname === "/reports"
                ? "bg-blue-600"
                : "hover:bg-slate-700"
            }`}
          >
            📄 Reports
          </Link>
        </li>

        {/* Settings */}
        <li>
          <Link
            href="/settings"
            className={`block p-2 rounded cursor-pointer ${
              pathname === "/settings"
                ? "bg-blue-600"
                : "hover:bg-slate-700"
            }`}
          >
            ⚙️ Settings
          </Link>
        </li>

      </ul>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full mt-8 p-2 rounded bg-red-600 hover:bg-red-700 text-white"
      >
        Logout
      </button>
    </aside>
  );
}