export default function Navbar() {
  return (
  <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-10 py-5 bg-white shadow-md z-50">
    <h2 className="text-2xl font-bold text-blue-600">
        LOOP AI
      </h2>

      <ul className="flex gap-8 text-gray-700 font-medium">
        <li className="cursor-pointer hover:text-blue-600">Home</li>
        <li className="cursor-pointer hover:text-blue-600">Dashboard</li>
        <li className="cursor-pointer hover:text-blue-600">Feedback</li>
        <li className="cursor-pointer hover:text-blue-600">Reports</li>
      </ul>

      <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
        Login
      </button>
    </nav>
  );
}