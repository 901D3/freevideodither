
function process() {
  processFrame();
  if (gCtx.video.paused || gCtx.video.ended || gCtx.isRendering) return;
  setTimeout(process, 0);
}

async function render() {
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
  canvas.style.hidden = true;

  for (let i = startFrame; i < totalFrames && !gCtx.video.ended; i++) {
    if (!gCtx.isRendering) {
      gCtx.video.muted = false;
      gCtx.video.loop = true;

      complete();
      return true;
    }

    const frameTime = i / gCtx.frameRate;

    await new Promise((resolve) => {
      gCtx.video.currentTime = frameTime;
      gCtx.video.addEventListener('seeked', resolve, { once: true });
    });

    processFrame();

    const blob = await new Promise(function (resolve) { canvas.toBlob(resolve, 'image/webp', gCtx.blobQuality) });

    WebMMuxer.addFrameFromBlob(new Uint8Array(await blob.arrayBuffer()), chunks);

    if (gCtx.renderingPaused) await WaitForResolve();

    // Yields so the UI stays responsive
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  complete();

  async function complete() {
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

var DitherErrorDiffusion = DITHERXYR.CreateDitherErrorDiffusion(true, true);
var DitherVariableErrorDiffusion = DITHERXYR.CreateDitherErrorDiffusion(false, true);

function processFrame() {
  const t0 = performance.now();
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
      gCtx.rNormalize, gCtx.rRescale);

    DITHERXYR.offsetIn = DITHERXYR.offsetOut = 1;
    DITHERXYR.DitherOrdered(
      imageData, imageData, gCtx.width, gCtx.height,
      ordered.compiledMatrix,
      gCtx.gNormalize, gCtx.gRescale);

    DITHERXYR.offsetIn = DITHERXYR.offsetOut = 2;
    DITHERXYR.DitherOrdered(
      imageData, imageData, gCtx.width, gCtx.height,
      ordered.compiledMatrix,
      gCtx.bNormalize, gCtx.bRescale);
  }
  else if (a === 'Arithmetic') {
    DITHERXYR.strideIn = DITHERXYR.strideOut = 4;

    DITHERXYR.offsetIn = DITHERXYR.offsetOut = 0;
    DITHERXYR.DitherArithmetic(imageData, imageData, gCtx.width, gCtx.height, arithmetic.fn, gCtx.rNormalize, gCtx.rRescale);

    DITHERXYR.offsetIn = DITHERXYR.offsetOut = 1;
    DITHERXYR.DitherArithmetic(imageData, imageData, gCtx.width, gCtx.height, arithmetic.fn, gCtx.gNormalize, gCtx.gRescale);

    DITHERXYR.offsetIn = DITHERXYR.offsetOut = 2;
    DITHERXYR.DitherArithmetic(imageData, imageData, gCtx.width, gCtx.height, arithmetic.fn, gCtx.bNormalize, gCtx.bRescale);
  }
  else if (a === 'ErrorDiffusion') {
    const tileCountX = gCtx.width / errorDiffs.compiledClassMap.width;
    const tileCountY = gCtx.height / errorDiffs.compiledClassMap.height;

    DITHERXYR.strideIn = DITHERXYR.strideOut = 4;

    DITHERXYR.offsetIn = DITHERXYR.offsetOut = 0;
    DitherErrorDiffusion(
      imageData, imageData, null, gCtx.width, gCtx.height,
      errorDiffs.compiledDiffuseKernel,
      errorDiffs.compiledClassMap,
      tileCountX, tileCountY,
      gCtx.rNormalize, gCtx.rRescale, 256);

    DITHERXYR.offsetIn = DITHERXYR.offsetOut = 1;
    DitherErrorDiffusion(
      imageData, imageData, null, gCtx.width, gCtx.height,
      errorDiffs.compiledDiffuseKernel,
      errorDiffs.compiledClassMap,
      tileCountX, tileCountY,
      gCtx.gNormalize, gCtx.gRescale, 256);

    DITHERXYR.offsetIn = DITHERXYR.offsetOut = 2;
    DitherErrorDiffusion(
      imageData, imageData, null, gCtx.width, gCtx.height,
      errorDiffs.compiledDiffuseKernel,
      errorDiffs.compiledClassMap,
      tileCountX, tileCountY,
      gCtx.bNormalize, gCtx.bRescale, 256);
  }
  else if (a === 'VariableErrorDiffusion') {
    const errorBuffer = new Float32Array(gCtx.width * gCtx.height);
    const tileCountX = gCtx.width / errorDiffs.compiledClassMap.width;
    const tileCountY = gCtx.height / errorDiffs.compiledClassMap.height;

    DITHERXYR.strideIn = DITHERXYR.strideOut = 4;

    DITHERXYR.offsetIn = DITHERXYR.offsetOut = 0;
    DitherVariableErrorDiffusion(
      imageData, imageData, errorBuffer, gCtx.width, gCtx.height,
      errorDiffs.compiledDiffuseKernel,
      errorDiffs.compiledClassMap,
      tileCountX, tileCountY,
      gCtx.rNormalize, gCtx.rRescale, 256);

    DITHERXYR.offsetIn = DITHERXYR.offsetOut = 1;
    errorBuffer.fill(0);
    DitherVariableErrorDiffusion(
      imageData, imageData, errorBuffer, gCtx.width, gCtx.height,
      errorDiffs.compiledDiffuseKernel,
      errorDiffs.compiledClassMap,
      tileCountX, tileCountY,
      gCtx.gNormalize, gCtx.gRescale, 256);

    DITHERXYR.offsetIn = DITHERXYR.offsetOut = 2;
    errorBuffer.fill(0);
    DitherVariableErrorDiffusion(
      imageData, imageData, errorBuffer, gCtx.width, gCtx.height,
      errorDiffs.compiledDiffuseKernel,
      errorDiffs.compiledClassMap,
      tileCountX, tileCountY,
      gCtx.bNormalize, gCtx.bRescale, 256);
  }

  gCtx.ctx.putImageData(frame, 0, 0);

  const speeds = document.getElementById('Speeds');
  speeds.innerText = '';

  const time = performance.now() - t0;
  const fps = 1000 / time;

  speeds.appendChild(document.createTextNode('fps: ' + fps + '/s, ' + time + 'ms'));
}

let lastUpdatedTime = 0;
