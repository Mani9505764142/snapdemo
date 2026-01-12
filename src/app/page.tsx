import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold">SnapDemo</h1>
        <p className="text-zinc-600">
          Record, trim, and share screen demos instantly.
        </p>

        <Link
          href="/record"
          className="inline-block px-6 py-3 bg-black text-white rounded-xl hover:bg-zinc-800 transition"
        >
          Start Recording
        </Link>
      </div>
    </main>
  );
}
