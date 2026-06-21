
Render = async function () {
  isRendering = true;

  WebMMuxer.init({
    codec: 'vp8', // Has to be VP8
    width: gCtx.width,
    height: gCtx.height,
    frameRate: gCtx.frameRate,
  });

  const chunks = [];

  const startTime = Number(document.getElementById('RenderStartTime').value ?? 0);
  const startFrame = Math.floor(startTime * gCtx.frameRate);
  const totalFrames = Math.ceil(gCtx.video.duration * gCtx.frameRate);
  gCtx.video.pause();
  gCtx.video.currentTime = startTime;
  gCtx.video.muted = true;
  gCtx.video.loop = false;

  for (let i = startFrame; i < totalFrames && !gCtx.video.ended; i++) {
    const t0 = performance.now();

    if (!gCtx.isRendering) {
      gCtx.video.muted = false;
      gCtx.video.loop = true;

      Complete();
      return true;
    }

    const frameTime = i / gCtx.frameRate;

    await new Promise((resolve) => {
      gCtx.video.currentTime = frameTime;
      gCtx.video.addEventListener('seeked', resolve, { once: true });
    });

    ProcessFrame();

    const blob = await new Promise(function (resolve) { canvas.toBlob(resolve, 'image/webp', gCtx.blobQuality) });

    WebMMuxer.addFrameFromBlob(new Uint8Array(await blob.arrayBuffer()), chunks);

    if (gCtx.renderingPaused) await WaitForResolve();

    const t = performance.now() - t0;
    SpeedsInit();
    SpeedsLog(i + "/" + (totalFrames - 1));
    SpeedsLog("fps: " + 1000 / t + "/s, " + t + "ms");

    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  Complete();

  async function Complete() {
    gCtx.video.muted = false;
    gCtx.video.loop = true;
    gCtx.video.controls = true;

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

RenderY4M = async function () {
  isRendering = true;

  let buffer = [];
  let size = 0;
  const threshold = document.getElementById('BufferSizeThreshold').value * 1024 * 1024;
  const colorSpace = document.getElementById('Y4MColorSpace').value;

  Y4MMuxer.width = gCtx.width;
  Y4MMuxer.height = gCtx.height;
  Y4MMuxer.frameRate = gCtx.frameRate;

  const textEnc = new TextEncoder();
  Y4MMuxer.Init(textEnc);
  Y4MMuxer.WriteHeader(colorSpace, buffer, textEnc);

  const startTime = Number(document.getElementById('RenderStartTime').value ?? 0);
  const startFrame = Math.floor(startTime * gCtx.frameRate);
  const totalFrames = Math.ceil(gCtx.video.duration * gCtx.frameRate);
  Speeds

  gCtx.video.pause();
  gCtx.video.currentTime = startTime;
  gCtx.video.muted = true;
  gCtx.video.loop = false;
  let yPlane;
  let uPlane;
  let vPlane;

  if (colorSpace === 'C420jpeg') {
    yPlane = new Uint8Array(gCtx.width * gCtx.height);
    uPlane = new Uint8Array(Math.floor(gCtx.width / 2) * Math.floor(gCtx.height / 2));
    vPlane = new Uint8Array(Math.floor(gCtx.width / 2) * Math.floor(gCtx.height / 2));
  }
  else if (colorSpace === 'C444') {
    yPlane = new Uint8Array(gCtx.width * gCtx.height);
    uPlane = new Uint8Array(gCtx.width * gCtx.height);
    vPlane = new Uint8Array(gCtx.width * gCtx.height);
  }

  for (let i = startFrame; i < totalFrames && !gCtx.video.ended; i++) {
    const t0 = performance.now();
    if (!gCtx.isRendering) {
      gCtx.video.muted = false;
      gCtx.video.loop = true;

      Complete();
      return;
    }

    const frameTime = i / gCtx.frameRate;

    await new Promise(function (resolve) {
      gCtx.video.currentTime = frameTime;
      gCtx.video.addEventListener('seeked', resolve, { once: true });
    });

    ProcessFrame();

    const frame = gCtx.ctx.getImageData(0, 0, gCtx.width, gCtx.height);
    const imageData = frame.data;

    for (let j = gCtx.width * gCtx.height - 1; j >= 0; j--) {
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

      for (let y = 0; y < gCtx.height; y += 2) {
        for (let x = 0; x < gCtx.width; x += 2) {
          let uSum = 0, vSum = 0;

          for (let dy = 0; dy < 2; dy++) {
            for (let dx = 0; dx < 2; dx++) {
              const px = (y + dy) * gCtx.width + (x + dx);
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

    if (gCtx.renderingPaused) await WaitForResolve();

    const t = performance.now() - t0;
    SpeedsInit();
    SpeedsLog(i + "/" + (totalFrames - 1));
    SpeedsLog("buffer size: " + size + "B / " + threshold + "B");
    SpeedsLog("fps: " + 1000 / t + "/s, " + t + "ms");
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  Complete();

  async function Complete() {
    gCtx.video.muted = false;
    gCtx.video.loop = true;
    gCtx.video.controls = true;

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

Process = function () {
  const t0 = performance.now();

  ProcessFrame();
  if (gCtx.video.paused || gCtx.video.ended || gCtx.isRendering) return;

  const time = performance.now() - t0;
  const fps = 1000 / time;

  SpeedsInit();
  SpeedsLog('fps: ' + fps + '/s, ' + time + 'ms');

  setTimeout(Process, 0);
};

function ProcessFrame() {
  gCtx.ctx.drawImage(gCtx.video, 0, 0, gCtx.width, gCtx.height);
  const frame = gCtx.ctx.getImageData(0, 0, gCtx.width, gCtx.height);
  const imageData = frame.data;

  if (gCtx.linear)
    for (let i = imageData.length - 1; i >= 0; i--) imageData[i] = gCtx.linearLUT[imageData[i]];

  const a = document.getElementById('Dither').value;

  if (a === 'Ordered') {
    DITHERXYR.strideIn = DITHERXYR.strideOut = 4;

    DITHERXYR.offsetIn = DITHERXYR.offsetOut = 0;
    DITHERXYR.DitherOrdered(
      imageData, imageData, gCtx.width, gCtx.height,
      ordered.compiledMatrix,
      palettes.compiledPaletteR);

    DITHERXYR.offsetIn = DITHERXYR.offsetOut = 1;
    DITHERXYR.DitherOrdered(
      imageData, imageData, gCtx.width, gCtx.height,
      ordered.compiledMatrix,
      palettes.compiledPaletteG);

    DITHERXYR.offsetIn = DITHERXYR.offsetOut = 2;
    DITHERXYR.DitherOrdered(
      imageData, imageData, gCtx.width, gCtx.height,
      ordered.compiledMatrix,
      palettes.compiledPaletteB);
  }
  else if (a === 'Arithmetic') {
    DITHERXYR.strideIn = DITHERXYR.strideOut = 4;

    DITHERXYR.offsetIn = DITHERXYR.offsetOut = 0;
    DITHERXYR.DitherArithmetic(imageData, imageData, gCtx.width, gCtx.height, arithmetic.fn, palettes.compiledPaletteR);

    DITHERXYR.offsetIn = DITHERXYR.offsetOut = 1;
    DITHERXYR.DitherArithmetic(imageData, imageData, gCtx.width, gCtx.height, arithmetic.fn, palettes.compiledPaletteG);

    DITHERXYR.offsetIn = DITHERXYR.offsetOut = 2;
    DITHERXYR.DitherArithmetic(imageData, imageData, gCtx.width, gCtx.height, arithmetic.fn, palettes.compiledPaletteB);
  }
  else if (a === 'ErrorDiffusion') {
    const tileCountX = gCtx.width / errorDiffs.compiledClassMap.width;
    const tileCountY = gCtx.height / errorDiffs.compiledClassMap.height;

    DITHERXYR.strideIn = DITHERXYR.strideOut = 4;

    DITHERXYR.offsetIn = DITHERXYR.offsetOut = 0;
    errorDiffs.fn.DitherErrorDiffusion(
      imageData, imageData, null, gCtx.width, gCtx.height,
      errorDiffs.compiledDiffuseKernel,
      errorDiffs.compiledClassMap,
      tileCountX, tileCountY,
      palettes.compiledPaletteR);

    DITHERXYR.offsetIn = DITHERXYR.offsetOut = 1;
    errorDiffs.fn.DitherErrorDiffusion(
      imageData, imageData, null, gCtx.width, gCtx.height,
      errorDiffs.compiledDiffuseKernel,
      errorDiffs.compiledClassMap,
      tileCountX, tileCountY,
      palettes.compiledPaletteG);

    DITHERXYR.offsetIn = DITHERXYR.offsetOut = 2;
    errorDiffs.fn.DitherErrorDiffusion(
      imageData, imageData, null, gCtx.width, gCtx.height,
      errorDiffs.compiledDiffuseKernel,
      errorDiffs.compiledClassMap,
      tileCountX, tileCountY,
      palettes.compiledPaletteB);
  }
  else if (a === 'VariableErrorDiffusion') {
    const errorBuffer = new Float32Array(gCtx.width * gCtx.height);
    const tileCountX = gCtx.width / errorDiffs.compiledClassMap.width;
    const tileCountY = gCtx.height / errorDiffs.compiledClassMap.height;

    DITHERXYR.strideIn = DITHERXYR.strideOut = 4;

    DITHERXYR.offsetIn = DITHERXYR.offsetOut = 0;
    errorDiffs.fn.DitherVariableErrorDiffusion(
      imageData, imageData, errorBuffer, gCtx.width, gCtx.height,
      errorDiffs.compiledDiffuseKernel,
      errorDiffs.compiledClassMap,
      tileCountX, tileCountY,
      palettes.compiledPaletteR);

    DITHERXYR.offsetIn = DITHERXYR.offsetOut = 1;
    errorBuffer.fill(0);
    errorDiffs.fn.DitherVariableErrorDiffusion(
      imageData, imageData, errorBuffer, gCtx.width, gCtx.height,
      errorDiffs.compiledDiffuseKernel,
      errorDiffs.compiledClassMap,
      tileCountX, tileCountY,
      palettes.compiledPaletteG);

    DITHERXYR.offsetIn = DITHERXYR.offsetOut = 2;
    errorBuffer.fill(0);
    errorDiffs.fn.DitherVariableErrorDiffusion(
      imageData, imageData, errorBuffer, gCtx.width, gCtx.height,
      errorDiffs.compiledDiffuseKernel,
      errorDiffs.compiledClassMap,
      tileCountX, tileCountY,
      palettes.compiledPaletteB);
  }

  gCtx.ctx.putImageData(frame, 0, 0);
}
