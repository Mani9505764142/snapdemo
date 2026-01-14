"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

// ---- GLOBAL MEMORY (INTENTIONAL) ----
declare global {
  interface Window {
    __RECORDED_VIDEO__?: Blob;
  }
}

export default function RecordPage() {
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const combinedStreamRef = useRef<MediaStream | null>(null);
  const router = useRouter();

  const [isRecording, setIsRecording] = useState(false);
  const [videoURL, setVideoURL] = useState<string | null>(null);

  // ---------- START RECORD (SCREEN + MIC) ----------
  const startRecording = async () => {
    try {
      // 1️⃣ Screen (video + system audio if available)
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      // 2️⃣ Microphone (your voice)
      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      // 3️⃣ Merge streams
      const combinedStream = new MediaStream([
        ...screenStream.getVideoTracks(),
        ...screenStream.getAudioTracks(),
        ...micStream.getAudioTracks(),
      ]);

      combinedStreamRef.current = combinedStream;

      const recorder = new MediaRecorder(combinedStream, {
        mimeType: "video/webm",
      });

      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);

        // store in memory
        window.__RECORDED_VIDEO__ = blob;
        sessionStorage.setItem("recordedVideoURL", url);
        setVideoURL(url);

        // stop all tracks cleanly
        combinedStream.getTracks().forEach((track) => track.stop());
        combinedStreamRef.current = null;
      };

      recorder.start();
      recorderRef.current = recorder;
      setIsRecording(true);
    } catch {
      alert("Permission denied (screen or microphone)");
    }
  };

  // ---------- STOP RECORD ----------
  const stopRecording = () => {
    recorderRef.current?.stop();
    setIsRecording(false);
  };

  // ---------- DOWNLOAD ----------
  const downloadVideo = () => {
    if (!videoURL) return;
    const a = document.createElement("a");
    a.href = videoURL;
    a.download = "screen-recording.webm";
    a.click();
  };

  // ---------- RETAKE ----------
  const recordAgain = () => {
    delete window.__RECORDED_VIDEO__;
    sessionStorage.removeItem("recordedVideoURL");
    setVideoURL(null);
    chunksRef.current = [];

    combinedStreamRef.current?.getTracks().forEach((t) => t.stop());
    combinedStreamRef.current = null;
  };

  // ---------- GO TO TRIM ----------
  const goToTrim = () => {
    router.push("/trim");
  };

  // ---------- UI ----------
  return (
    <div className="record-wrapper">
      <div className="record-card">
        <h1>Screen Recorder</h1>
        <p className="subtitle">
          Record your screen, preview it, trim it, then share.
        </p>

        {videoURL ? (
          <video className="preview" src={videoURL} controls />
        ) : (
          <div className="placeholder">
            {isRecording ? "Recording in progress…" : "Ready to record"}
          </div>
        )}

        <div className="actions">
          {!isRecording && !videoURL && (
            <button className="btn primary" onClick={startRecording}>
              Start Recording
            </button>
          )}

          {isRecording && (
            <button className="btn danger" onClick={stopRecording}>
              Stop Recording
            </button>
          )}

          {videoURL && !isRecording && (
            <>
              <button className="btn success" onClick={downloadVideo}>
                Download
              </button>

              <button className="btn secondary" onClick={recordAgain}>
                Record Again
              </button>

              <button className="btn primary" onClick={goToTrim}>
                Trim Video
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
