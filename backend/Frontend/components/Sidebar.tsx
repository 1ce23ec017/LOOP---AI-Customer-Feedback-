"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 h-screen bg-slate-900 text-white p-6">
      <h2 className="text-2xl font-bold mb-8">
        LOOP AI
      </h2>

      <ul className="space-y-4">
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
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="w-full mt-8 p-2 rounded bg-red-600 hover:bg-red-700 text-white"
      >
        Logout
      </button>
    </aside>
  );
}