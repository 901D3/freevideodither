const d = {
  none: () => {},
  matrixThreshold: bayer,
  arithmetic: arithmetic,
  errDiffs: errDiffs,
  varErrDiffs: varErrDiffs,
};

function process() {
  const t0 = performance.now();
  processFrame();
  if (t) frameCounter();
  if (video.paused || video.ended || isRendering) return;
  setTimeout(process, max(0, frameTime - (performance.now() - t0)));
}

async function render() {
  if (isRecording == true) {
    printLog("Stop recording to start rendering");
    return false;
  }
  if (isRendering == true) {
    printLog("Rendering process has already started");
    return false;
  }
  isRendering = true;
  startRec.setAttribute("disabled", "");
  stopRec.setAttribute("disabled", "");
  pauseRec.setAttribute("disabled", "");
  resumeRec.setAttribute("disabled", "");

  printLog("Starting rendering");

  const muxer = new WebMMuxer({
    codec: "vp8", // Has to be VP8
    width: canvasWidth,
    height: canvasHeight,
    frameRate: recorderFrameRate,
    bufferSize: Number(gId("bufferSizeInput").value),
  });
  const chunks = [];

  const startPositionSeconds = Number(gId("rendererStartPosition").value ?? 0);
  const startFrame = floor(startPositionSeconds * recorderFrameRate);
  const totalFrames = ceil(video.duration * recorderFrameRate);
  printLog("Total frames:" + totalFrames);
  video.pause();
  video.currentTime = startPositionSeconds;
  video.muted = true;
  video.loop = false;

  let maxConcurrentEncodes = Number(gId("rendererMaxConcurrentEncodes").value);
  if (!Number.isInteger(maxConcurrentEncodes)) {
    printLog("Max concurrent encodes default to 2");
    maxConcurrentEncodes = 2;
  }

  const encodeQueue = new Set();

  performance.mark("renderStart");

  for (let frameIndex = startFrame; frameIndex < totalFrames && !video.ended; frameIndex++) {
    const frameTime = frameIndex / recorderFrameRate;

    performance.mark("videoDrawStart");
    await new Promise((r) => {
      video.currentTime = frameTime;
      video.addEventListener("seeked", r, {once: true});
    });
    processFrame();
    performance.mark("videoDrawEnd");

    const encodePromise = (async () => {
      performance.mark("toBlobStart");
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/webp", blobQuality));
      performance.mark("toBlobEnd");

      const buffer = new Uint8Array(await blob.arrayBuffer());
      muxer.addFrameFromBlob(buffer, chunks);
    })();

    encodeQueue.add(encodePromise);
    encodePromise.finally(() => encodeQueue.delete(encodePromise));

    if (encodeQueue.size >= maxConcurrentEncodes) await Promise.race(encodeQueue);

    if (isRendering == false) {
      printLog("Rendering stopped manually");
      isRendering = false;
      video.muted = false;
      video.loop = true;

      onComplete();
      return true;
    }

    if (t) {
      performance.measure("videoDraw", "videoDrawStart", "videoDrawEnd");
      videoDraw = performance.getEntriesByName("videoDraw").at(-1)?.duration ?? 0;

      performance.measure("toBlob", "toBlobStart", "toBlobEnd");
      const toBlob = performance.getEntriesByName("toBlob").at(-1)?.duration ?? 0;

      printLog("Video draw: " + videoDraw + "ms\n" + "toBlob: " + toBlob + "ms\n");

      performance.clearMarks("videoDrawStart");
      performance.clearMarks("videoDrawEnd");
      performance.clearMarks("toBlobStart");
      performance.clearMarks("toBlobEnd");
      performance.clearMeasures("videoDraw");
      performance.clearMeasures("toBlob");
    }

    if (pausedRendering) await waitForResolve();
    // Yields so the UI stays responsive
    await new Promise((r) => setTimeout(r, 0));
  }

  performance.mark("renderEnd");
  performance.measure("render", "renderStart", "renderEnd");
  const renderTime = performance.getEntriesByName("render").at(-1)?.duration ?? 0;
  printLog(
    "Elapsed: " + renderTime + "\n" + "Rendering takes " + (renderTime / (video.duration * 1000)) * 100 + "% of video duration"
  );

  onComplete();

  async function onComplete() {
    await Promise.all(encodeQueue);
    isRendering = false;
    video.muted = false;
    video.loop = true;
    video.controls = true;

    const blob = muxer.finalize(chunks);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "video.webm";
    a.click();
    URL.revokeObjectURL(url);
    printLog("Rendered video: " + "<a href='" + url + "' target='_blank'>" + url + "</a>", null);

    isRendering = false;
    startRend.removeAttribute("disabled", "");
    stopRend.setAttribute("disabled", "");

    startRec.removeAttribute("disabled");
    stopRec.setAttribute("disabled", "");
    pauseRec.setAttribute("disabled", "");
    resumeRec.setAttribute("disabled", "");
    return true;
  }
}

async function streamlinedRender() {
  if (isRecording == true) {
    printLog("Stop recording to start render");
    return false;
  }
  if (isRendering == true) {
    printLog("Rendering process has already started");
    return false;
  }
  isRendering = true;

  printLog("Starting rendering");

  const bufferSize = Number(gId("bufferSizeInput").value);
  const muxer = new WebMMuxer({
    codec: gId("renderCodec").value === "vp09" ? "vp9" : gId("renderCodec").value,
    width: canvasWidth,
    height: canvasHeight,
    frameRate: recorderFrameRate,
    bufferSize: bufferSize,
    profile: 0,
    level: 0xff,
    bitDepth: 8,
    chromaSubsampling: 1,
    colorRange: 1,
    colorPrimaries: 1,
    transferCharacteristics: 1,
  });
  const chunks = [];

  const startPositionSeconds = Number(gId("rendererStartPosition").value ?? 0);
  const startFrame = floor(startPositionSeconds * recorderFrameRate);
  const totalFrames = ceil(video.duration * recorderFrameRate);
  printLog("Total frames:" + totalFrames);
  video.pause();
  video.currentTime = startPositionSeconds;
  video.muted = true;
  video.loop = false;
  video.controls = false;
  canvas.style.hidden = true;

  performance.mark("WebCodecsSetupStart");
  const WCodecEncoder = new VideoEncoder({
    output: (chunk) => {
      const buffer = new Uint8Array(chunk.byteLength);
      chunk.copyTo(buffer);
      muxer.addFramePreEncoded(buffer, chunks);
    },
    error: (err) => console.error(err),
  });

  WCodecEncoder.configure({
    codec: gId("renderCodec").value === "vp09" ? "vp09.00.10.8.01" : gId("renderCodec").value,
    width: canvasWidth,
    height: canvasHeight,
    framerate: recorderFrameRate,
    bitrate: recorderVideoBitrate,
  });
  performance.mark("WebCodecsSetupEnd");
  performance.measure("WebCodecsSetup", "WebCodecsSetupStart", "WebCodecsSetupEnd");
  printLog("WebCodecs setup: " + (performance.getEntriesByName("WebCodecsSetup").at(-1)?.duration ?? 0) + "ms");

  performance.mark("renderStart");

  for (let frameIndex = startFrame; frameIndex < totalFrames && !video.ended; frameIndex++) {
    const frameTime = frameIndex / recorderFrameRate;

    performance.mark("videoDrawStart");
    await new Promise((r) => {
      video.currentTime = frameTime;
      video.addEventListener("seeked", r, {once: true});
    });
    processFrame();
    performance.mark("videoDrawEnd");

    performance.mark("toFrameStart");
    const videoFrame = new VideoFrame(canvas, {
      timestamp: frameTime * 1000000,
    });
    performance.mark("toFrameEnd");

    WCodecEncoder.encode(videoFrame, {
      keyframe: frameIndex >= bufferSize ? true : false,
    });
    videoFrame.close();

    if (isRendering == false) {
      printLog("Rendering stopped manually");
      isRendering = false;
      video.muted = false;
      video.loop = true;

      onComplete();
      return true;
    }

    if (t) {
      performance.measure("videoDraw", "videoDrawStart", "videoDrawEnd");
      videoDraw = performance.getEntriesByName("videoDraw").at(-1)?.duration ?? 0;

      performance.measure("toFrame", "toFrameStart", "toFrameEnd");
      const toFrame = performance.getEntriesByName("toFrame").at(-1)?.duration ?? 0;

      printLog("Video draw: " + videoDraw + "ms\n" + "toFrame: " + toFrame + "ms\n");

      performance.clearMarks("videoDrawStart");
      performance.clearMarks("videoDrawEnd");
      performance.clearMarks("toFrameStart");
      performance.clearMarks("toFrameEnd");
      performance.clearMeasures("videoDraw");
      performance.clearMeasures("toFrame");
    }

    await new Promise((r) => setTimeout(r, 0));
  }
  performance.mark("renderEnd");
  performance.measure("render", "renderStart", "renderEnd");

  const renderTime = performance.getEntriesByName("render").at(-1)?.duration ?? 0;
  printLog(
    "Elapsed: " + renderTime + "\n" + "Rendering takes " + (renderTime / (video.duration * 1000)) * 100 + "% of video duration"
  );

  onComplete();

  async function onComplete() {
    await WCodecEncoder.flush();
    WCodecEncoder.close();

    isRendering = false;
    video.muted = false;
    video.loop = true;
    video.controls = true;

    const blob = muxer.finalize(chunks);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "video.webm";
    a.click();
    URL.revokeObjectURL(url);
    printLog("Rendered video: " + "<a href='" + url + "' target='_blank'>" + url + "</a>", null);

    isRendering = false;
    startRend.removeAttribute("disabled", "");
    stopRend.setAttribute("disabled", "");

    startRec.removeAttribute("disabled");
    stopRec.setAttribute("disabled", "");
    pauseRec.setAttribute("disabled", "");
    resumeRec.setAttribute("disabled", "");
    return true;
  }
}

function processFrame() {
  ctx.drawImage(video, 0, 0, canvasWidth, canvasHeight);
  const frame = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  const imageData = frame.data;
  const imageDataLength = imageData.length;
  if (useLinear) {
    for (let i = 0; i < imageDataLength; i++) {
      imageData[i] = floor(linearLUT[imageData[i]]);
    }
  }
  d[ditherDropdownValue](imageData);

  ctx.putImageData(frame, 0, 0);
}

function frameCounter() {
  frm++;
  let dlT = (performance.now() - lastUpdatedTime) / 1000;
  let currentFps = 1 / dlT;
  lastUpdatedTime = performance.now();
  if (performance.now() - lLT >= 1000) {
    printLog("Fps: " + currentFps.toString().padEnd(22) + " | Latency: " + (dlT * 1000).toString().padEnd(22));
    lLT = performance.now();
  }
}

gId("showTelemetry").addEventListener("change", function () {
  t = gId("showTelemetry").checked;
});

video.addEventListener("play", function () {
  frm = 0;
  startTime = performance.now();
  lastUpdatedTime = startTime;
  lLT = startTime;
  process();
});

video.addEventListener("seeking", processFrame);
