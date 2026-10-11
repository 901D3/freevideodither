
async function Render() {
  WebMMuxer.init({
    codec: 'vp8', // Has to be VP8
    width: gctx.canvas.width,
    height: gctx.canvas.height,
    frameRate: gctx.render_framerate,
  });

  const chunks = [];

  const startTime = Number(document.getElementById('RenderStartTime').value ?? 0);
  const startFrame = Math.floor(startTime * gctx.render_framerate);
  const totalFrames = Math.ceil(gctx.video.duration * gctx.render_framerate);
  gctx.video.pause();
  gctx.video.currentTime = startTime;
  gctx.video.muted = true;
  gctx.video.loop = false;

  for (let i = startFrame; i < totalFrames && !gctx.video.ended; i++) {
    const t0 = performance.now();

    if (!gctx.render_isrendering) {
      gctx.video.muted = false;
      gctx.video.loop = true;

      Complete();
      return true;
    }

    const frameTime = i / gctx.render_framerate;

    await new Promise((resolve) => {
      gctx.video.currentTime = frameTime;
      gctx.video.addEventListener('seeked', resolve, { once: true });
    });

    RenderFrame();

    const blob = await new Promise(function (resolve) { canvas.toBlob(resolve, 'image/webp', gctx.render_blobquality) });

    WebMMuxer.addFrameFromBlob(new Uint8Array(await blob.arrayBuffer()), chunks);

    if (gctx.render_paused) await WaitForResolve();

    const t = performance.now() - t0;
    SpeedsInit();
    SpeedsLog(i + "/" + (totalFrames - 1));
    SpeedsLog("fps: " + 1000 / t + "/s, " + t + "ms");

    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  Complete();

  async function Complete() {
    gctx.video.muted = false;
    gctx.video.loop = true;
    gctx.video.controls = true;

    const blob = WebMMuxer.finalize(chunks);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = crypto.randomUUID() + '.webm';
    a.click();
    URL.revokeObjectURL(url);

    StopRendering();

    return true;
  }
}

async function RenderY4M() {
  let buffer = [];
  let size = 0;
  const threshold = document.getElementById('BufferSizeThreshold').value * 1024 * 1024;
  const colorSpace = document.getElementById('Y4MColorSpace').value;

  Y4MMuxer.width = gctx.canvas.width;
  Y4MMuxer.height = gctx.canvas.height;
  Y4MMuxer.frameRate = gctx.render_framerate;

  const textEnc = new TextEncoder();
  Y4MMuxer.Init(textEnc);
  Y4MMuxer.WriteHeader(colorSpace, buffer, textEnc);

  const startTime = Number(document.getElementById('RenderStartTime').value ?? 0);
  const startFrame = Math.floor(startTime * gctx.render_framerate);
  const totalFrames = Math.ceil(gctx.video.duration * gctx.render_framerate);
  Speeds

  gctx.video.pause();
  gctx.video.currentTime = startTime;
  gctx.video.muted = true;
  gctx.video.loop = false;
  let yPlane;
  let uPlane;
  let vPlane;

  if (colorSpace === 'C420jpeg') {
    yPlane = new Uint8Array(gctx.canvas.width * gctx.canvas.height);
    uPlane = new Uint8Array(Math.floor(gctx.canvas.width / 2) * Math.floor(gctx.canvas.height / 2));
    vPlane = new Uint8Array(Math.floor(gctx.canvas.width / 2) * Math.floor(gctx.canvas.height / 2));
  }
  else if (colorSpace === 'C444') {
    yPlane = new Uint8Array(gctx.canvas.width * gctx.canvas.height);
    uPlane = new Uint8Array(gctx.canvas.width * gctx.canvas.height);
    vPlane = new Uint8Array(gctx.canvas.width * gctx.canvas.height);
  }

  for (let i = startFrame; i < totalFrames && !gctx.video.ended; i++) {
    const t0 = performance.now();
    if (!gctx.render_isrendering) {
      gctx.video.muted = false;
      gctx.video.loop = true;

      Complete();
      return;
    }

    const frameTime = i / gctx.render_framerate;

    await new Promise(function (resolve) {
      gctx.video.currentTime = frameTime;
      gctx.video.addEventListener('seeked', resolve, { once: true });
    });

    RenderFrame();

    const frame = gctx.canvas_ctx.getImageData(0, 0, gctx.canvas.width, gctx.canvas.height);
    const imageData = frame.data;

    for (let j = gctx.canvas.width * gctx.canvas.height - 1; j >= 0; j--) {
      const idx = j * 4;

      const r1 = imageData[idx];
      const g1 = imageData[idx + 1];
      const b1 = imageData[idx + 2];

      yPlane[j] = Math.max(0, Math.min(255, Y4MMuxer.RGBToY(r1, g1, b1)));

      if (colorSpace === 'C444') {
        uPlane[j] = Math.max(0, Math.min(255, Y4MMuxer.RGBToU(r1, g1, b1)));
        vPlane[j] = Math.max(0, Math.min(255, Y4MMuxer.RGBToV(r1, g1, b1)));
      }
    }

    if (colorSpace === 'C420jpeg') {
      let idx = 0;

      for (let y = 0; y < gctx.canvas.height; y += 2) {
        for (let x = 0; x < gctx.canvas.width; x += 2) {
          let uSum = 0, vSum = 0;

          for (let dy = 0; dy < 2; dy++) {
            for (let dx = 0; dx < 2; dx++) {
              const px = (y + dy) * gctx.canvas.width + (x + dx);
              const idx2 = px * 4;

              const r2 = imageData[idx2];
              const g2 = imageData[idx2 + 1];
              const b2 = imageData[idx2 + 2];

              uSum += Y4MMuxer.RGBToU(r2, g2, b2);
              vSum += Y4MMuxer.RGBToV(r2, g2, b2);
            }
          }

          uPlane[idx] = Math.max(0, Math.min(255, (uSum / 4)));
          vPlane[idx] = Math.max(0, Math.min(255, (vSum / 4)));
          idx++;
        }
      }
    }

    Y4MMuxer.AppendFrame(yPlane, uPlane, vPlane, buffer);

    size += yPlane.byteLength;
    size += uPlane.byteLength;
    size += vPlane.byteLength;
    if (size >= threshold) {
      Flush();

      buffer = [];
      size = 0;

      Y4MMuxer.WriteHeader(colorSpace, buffer, textEnc);
    }

    if (gctx.render_paused) await WaitForResolve();

    const t = performance.now() - t0;
    SpeedsInit();
    SpeedsLog(i + "/" + (totalFrames - 1));
    SpeedsLog("buffer size: " + size + "B / " + threshold + "B");
    SpeedsLog("fps: " + 1000 / t + "/s, " + t + "ms");
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  Complete();

  async function Complete() {
    gctx.video.muted = false;
    gctx.video.loop = true;
    gctx.video.controls = true;

    const url = URL.createObjectURL(new Blob(buffer, { type: 'application/octet-stream' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = crypto.randomUUID() + '.y4m';
    a.click();
    URL.revokeObjectURL(url);

    StopRendering();
  }

  async function Flush() {
    const url = URL.createObjectURL(new Blob(buffer, { type: 'application/octet-stream' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = crypto.randomUUID() + '.y4m';
    a.click();
    URL.revokeObjectURL(url);
  }
};

var startRenderBtn;
var stopRenderBtn;
var pauseRenderBtn;
var resumeRenderBtn;

function StartRendering() {
  gctx.render_isrendering = true;
  gctx.render_paused = false;

  startRenderBtn.setAttribute("disabled", "");
  stopRenderBtn.removeAttribute("disabled", "");

  if (gctx.render_y4m) RenderY4M();
  else Render();
}

function StopRendering() {
  gctx.render_isrendering = false;
  gctx.render_paused = false;

  startRenderBtn.removeAttribute("disabled", "");
  stopRenderBtn.setAttribute("disabled", "");
  pauseRenderBtn.setAttribute("disabled", "");
  resumeRenderBtn.setAttribute("disabled", "");
}

function PauseRendering() {
  gctx.render_paused = true;

  pauseRenderBtn.setAttribute("disabled", "");
  resumeRenderBtn.removeAttribute("disabled");
}

function ResumeRendering() {
  gctx.render_paused = false;

  gctx.resumeRenderFn();

  pauseRenderBtn.removeAttribute("disabled");
  resumeRenderBtn.setAttribute("disabled", "");
}

RendererInit = function () {
  startRenderBtn = document.getElementById("StartRenderBtn");
  stopRenderBtn = document.getElementById("StopRenderBtn");
  pauseRenderBtn = document.getElementById("PauseRenderBtn");
  resumeRenderBtn = document.getElementById("ResumeRenderBtn");

  startRenderBtn.addEventListener("click", StartRendering);
  stopRenderBtn.addEventListener("click", StopRendering);
  pauseRenderBtn.addEventListener("click", PauseRendering);
  resumeRenderBtn.addEventListener("click", ResumeRendering);

  document.getElementById("RenderBlobQuality").addEventListener("input",
    function () { gctx.render_blobquality = document.getElementById("RenderBlobQuality").value; });

  document.getElementById("RenderFrameRate").addEventListener("input",
    function () { gctx.render_framerate = document.getElementById("RenderFrameRate").value; });

  document.getElementById("RenderStartTime").value = 0;
  document.getElementById("RenderBlobQuality").value = gctx.render_blobquality;
  document.getElementById("BufferSizeThreshold").value = 64;
  document.getElementById("RenderFrameRate").value = gctx.render_framerate;
};
