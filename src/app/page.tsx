import Link from "next/link";

export default function Home() {
  return (
    <main className="home-page">
      <div className="hero">
        <h1 className="brand">SnapDemo</h1>

        <p className="subtitle">
          Record, trim, and share screen demos instantly.
        </p>

        <ul className="features">
          <li>🎥 One-click screen recording</li>
          <li>✂️ Trim before sharing</li>
          <li>📊 Shareable link with analytics</li>
        </ul>

        <div className="action-row">
          <Link href="/record" className="btn primary">
            Start Recording
          </Link>

          <div className="demo-action">
            <Link
              href="/share/videos%2F1768378601579-video.webm"
              className="btn ghost"
            >
              View Demo
            </Link>

            <span className="demo-views">👀 Viewed 8 times</span>
          </div>
        </div>
      </div>
    </main>
  );
}
