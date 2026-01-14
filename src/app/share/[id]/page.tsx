"use client";

import { useRef, useState } from "react";
import { useParams } from "next/navigation";

export default function SharePage() {
  const { id } = useParams();
  const key = decodeURIComponent(id as string);

  const videoRef = useRef<HTMLVideoElement>(null);
  const hasTrackedView = useRef(false);

  const [copied, setCopied] = useState(false);

  const videoURL = `https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;

  // ✅ VIEW TRACK — only when video actually plays
  const onPlay = () => {
    if (hasTrackedView.current) return;
    hasTrackedView.current = true;

    fetch("/api/analytics/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    }).catch(() => {});
  };

  // ✅ COMPLETION TRACK — already correct
  const onEnded = () => {
    fetch("/api/analytics/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    }).catch(() => {});
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(
      `${window.location.origin}/share/${encodeURIComponent(key)}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="record-wrapper">
      <div className="record-card share-card">
        <h1>Your video is ready</h1>
        <p className="subtitle">
          Share this link with anyone. It works on any device.
        </p>

        <video
          ref={videoRef}
          className="video-preview"
          src={videoURL}
          controls
          onPlay={onPlay}
          onEnded={onEnded}
        />

        <div className="action-row">
          <a href={videoURL} download className="btn success">
            ⬇ Download
          </a>

          <button onClick={copyLink} className="btn primary">
            {copied ? "Copied!" : "🔗 Copy Link"}
          </button>
        </div>
      </div>
    </div>
  );
}
