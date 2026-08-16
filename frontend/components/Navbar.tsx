import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed left-0 top-0 z-50 flex w-full items-center justify-between bg-white px-10 py-5 shadow-md">
      
      {/* Logo */}
      <Link
        href="/"
        className="text-2xl font-bold text-blue-600"
      >
        LOOP AI
      </Link>

      {/* Login */}
      <Link
        href="/login"
        className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
      >
        Login
      </Link>

    </nav>
  );
}