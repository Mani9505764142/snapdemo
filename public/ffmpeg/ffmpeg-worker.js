importScripts("/ffmpeg/ffmpeg-core.js");

const { createFFmpeg, fetchFile } = FFmpeg;

const ffmpeg = createFFmpeg({
  log: true,
  corePath: "/ffmpeg/ffmpeg-core.js",
});

self.onmessage = async (e) => {
  const { videoBlob, start, end } = e.data;

  try {
    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }

    ffmpeg.FS("writeFile", "input.webm", await fetchFile(videoBlob));

    await ffmpeg.run(
      "-ss", `${start}`,
      "-to", `${end}`,
      "-i", "input.webm",
      "-c", "copy",
      "output.webm"
    );

    const data = ffmpeg.FS("readFile", "output.webm");

    const trimmedBlob = new Blob([data.buffer], {
      type: "video/webm",
    });

    self.postMessage({ success: true, blob: trimmedBlob });
  } catch (err) {
    self.postMessage({ success: false, error: err.toString() });
  }
};
