export default function SettingsPage() {
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
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-2">
              Change Password
            </label>

            <input
              type="password"
              placeholder="New Password"
              className="w-full border rounded-lg p-3"
            />
          </div>

          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Save Changes
          </button>

        </div>
    </>
  );
}