"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

        <li className="hover:bg-slate-700 p-2 rounded cursor-pointer">
          📈 Analytics
        </li>

        <li className="hover:bg-slate-700 p-2 rounded cursor-pointer">
          📄 Reports
        </li>

        <li className="hover:bg-slate-700 p-2 rounded cursor-pointer">
          ⚙️ Settings
        </li>
      </ul>
    </aside>
  );
}