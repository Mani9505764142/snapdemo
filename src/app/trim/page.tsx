"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// ---- GLOBAL MEMORY ----
declare global {
  interface Window {
    __RECORDED_VIDEO__?: Blob;
  }
}

export default function TrimPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [processing, setProcessing] = useState(false);

  // ---------- LOAD VIDEO URL ----------
  useEffect(() => {
    const url = sessionStorage.getItem("recordedVideoURL");
    if (!url || !window.__RECORDED_VIDEO__) {
      router.push("/record");
      return;
    }
    setVideoURL(url);
  }, [router]);

  // ---------- UPLOAD ----------
  const uploadBlob = async (blob: Blob) => {
    try {
      const file = new File([blob], "video.webm", { type: "video/webm" });
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      router.push(`/share/${encodeURIComponent(data.key)}`);
    } catch {
      alert("Upload failed");
    } finally {
      setProcessing(false);
    }
  };

  // ---------- UPLOAD ORIGINAL ----------
  const uploadOriginal = async () => {
    const blob = window.__RECORDED_VIDEO__;
    if (!blob) {
      alert("No video found. Please record again.");
      router.push("/record");
      return;
    }

    setProcessing(true);
    await uploadBlob(blob);
  };

  // ---------- TRIM & UPLOAD ----------
  const trimAndUpload = async () => {
    if (!videoRef.current || !window.__RECORDED_VIDEO__) return;

    if (end <= start) {
      alert("End time must be greater than start time");
      return;
    }

    // ✅ FIXED TYPE — THIS WAS THE BUILD BREAKER
    const video = videoRef.current as HTMLVideoElement;
    if (!video) return;

    const stream = video.captureStream();
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    const chunks: Blob[] = [];

    setProcessing(true);

    recorder.ondataavailable = (e) => {
      if (e.data.size) chunks.push(e.data);
    };

    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      await uploadBlob(blob);
    };

    video.currentTime = start;
    await video.play();
    recorder.start();

    const stopAtEnd = () => {
      if (video.currentTime >= end) {
        recorder.stop();
        video.pause();
        video.removeEventListener("timeupdate", stopAtEnd);
      }
    };

    video.addEventListener("timeupdate", stopAtEnd);
  };

  // ---------- NO VIDEO GUARD ----------
  if (!videoURL) {
    return (
      <div className="page-center">
        <h2>No recorded video found</h2>
        <p>You need to record a screen first.</p>

        <button
          className="btn primary"
          onClick={() => router.push("/record")}
        >
          Go to Recorder
        </button>
      </div>
    );
  }

  // ---------- UI ----------
  return (
    <div className="record-wrapper">
      <div className="record-card trim-card">
        <h1>Trim Video</h1>
        <p className="subtitle">Trim your recording or upload it as-is</p>

        <video
          ref={videoRef}
          src={videoURL}
          controls
          className="video-preview"
          onLoadedMetadata={(e) =>
            setEnd(Math.floor((e.target as HTMLVideoElement).duration))
          }
        />

        <div className="time-controls">
          <div>
            <label>Start (sec)</label>
            <input
              type="number"
              min={0}
              value={start}
              onChange={(e) => setStart(+e.target.value)}
              disabled={processing}
            />
          </div>

          <div>
            <label>End (sec)</label>
            <input
              type="number"
              min={0}
              value={end}
              onChange={(e) => setEnd(+e.target.value)}
              disabled={processing}
            />
          </div>
        </div>

        <div className="action-row">
          <button
            className="btn secondary"
            onClick={uploadOriginal}
            disabled={processing}
          >
            Upload Without Trim
          </button>

          <button
            className="btn primary"
            onClick={trimAndUpload}
            disabled={processing}
          >
            {processing ? "Processing…" : "Trim & Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
