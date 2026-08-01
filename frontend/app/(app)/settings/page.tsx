"use client";
import { useEffect, useState } from "react";
export default function SettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch("/api/settings");

        if (!response.ok) {
          throw new Error("Failed to load settings.");
        }

        const data = await response.json();

        setName(data.name || "");
        setEmail(data.email || "");
      } catch (error) {
        console.error("Settings load error:", error);
      }
    };

    loadSettings();
  }, []);

  return (
    <>
        <h1 className="text-4xl font-bold">
          Settings
        </h1>

        <p className="text-gray-600 mt-2">
          Manage your account and application preferences.
        </p>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-8">

          <div className="mb-6">
            <label className="block font-semibold mb-2">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-2">
              Change Password
            </label>

            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <p className="mt-2 text-xs text-gray-500">
              Leave this field empty if you do not want to change your password.
            </p>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={async () => {
              setSaveMessage("");
              setSaving(true);

                if (!email.trim()) {
                  setSaveMessage("Email is required.");
                  setSaving(false);
                  return;
                }

                if (!email.includes("@")) {
                  setSaveMessage("Please enter a valid email address.");
                  setSaving(false);
                  return;
                } 
               
              try {
                const response = await fetch("/api/settings", {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    name,
                    email,
                    password,
                  }),
                });

                const data = await response.json();

                if (!response.ok) {
                  throw new Error(data.error || "Failed to save changes.");
                }

                setSaveMessage("Changes saved successfully.");
                setPassword("");
              } catch (error) {
                setSaveMessage(
                  error instanceof Error
                    ? error.message
                    : "Failed to save changes."
                );
              } finally {
                setSaving(false);
              }
            }}
            className="rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "save Changes"}
          </button>
          {saveMessage && (
            <p className="mt-4 text-sm font-medium text-green-600">
              {saveMessage}
            </p>
          )}
        </div>
    </>
  );
}