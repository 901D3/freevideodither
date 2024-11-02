const dthrMth = {
  //Grayscale
  "bayer2x2": bayer,
  "bayer4x4": bayer,
  "bayer8x8": bayer,
  "bayer16x16": bayer,
  "bayer32x32": bayer,
  "bayer64x64": bayer,
  "bayer128x128": bayer,

  "cluster4x4": bayer,
  "cluster8x8": bayer,
  
  "hatchleft4x4": bayer,
  "hatchright4x4": bayer,
  "hatchhorizontal4x4": bayer,
  "hatchvertical4x4": bayer,


  //Colored
  "bayer2x2rgb": bayerRgb,
  "bayer4x4rgb": bayerRgb,
  "bayer8x8rgb": bayerRgb,
  "bayer16x16rgb": bayerRgb,
  "bayer32x32rgb": bayerRgb,
  "bayer64x64rgb": bayerRgb,
  "bayer128x128rgb": bayerRgb,

  "cluster4x4rgb": bayerRgb,
  "cluster8x8rgb": bayerRgb,

  "hatchleft4x4rgb": bayerRgb,
  "hatchright4x4rgb": bayerRgb,
  "hatchhorizontal4x4rgb": bayerRgb,
  "hatchvertical4x4rgb": bayerRgb,

  "arithmeticaddrgb": arithmeticAddRgb,
  "arithmeticaddconvrgb": arithmeticAddConvRgb,
  "arithmeticxorrgb": arithmeticXorRgb,
  "arithmeticxorconvrgb": arithmeticXorConvRgb,

  "floydsteinbergrgb": floydSteinbergRgb,
  "fanrgb": fanRgb,
  "shiaufanrgb": shiauFanRgb,
  "shiaufan2rgb": shiauFan2Rgb,

  "atkinsonrgb": atkinsonRgb,
  "burkesrgb": burkesRgb,
  "javisjudiceninkergb": jJNRgb,
  "stuckirgb": stuckiRgb,

  "sierrargb": sierraRgb,
  "sierralitergb": sierraLiteRgb,
  "sierra2rgb": sierra2Rgb,
  "sierra3rgb": sierra3Rgb,
  
  "twodrgb": twoDRgb,
};

// Initialize global variables
var frm = 0;
var stT = 0;
var lsUpdT = 0;
var lLT = 0;

function processVideo() {
  frm = 0;
  stT = performance.now();
  lsUpdT = stT;
  lLT = stT;
  processFrame();
}

function processFrame() {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  let fD = ctx.getImageData(0, 0, canvas.width, canvas.height);

  let mth = document.getElementById("ditherMethod").value;
  if (dthrMth[mth]) {
    dthrMth[mth](fD);
  }

  ctx.imageSmoothingEnabled = false;
  ctx.putImageData(fD, 0, 0);
  ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);

  frm++;
  let crT = performance.now();
  let esT = (crT - stT) / 1000;
  let avgFps = frm / esT;
  let dlT = (crT - lsUpdT) / 1000;
  let crFps = dlT > 0 ? 1 / dlT : 0;

  lsUpdT = crT;

  if (crT - lLT >= 500) {
    printLog(`elapsed: ${esT.toString().padEnd(22)} | processed: ${frm.toString().padEnd(22)} | AvgFps: ${avgFps.toString().padEnd(22)} | Fps: ${crFps.toString().padEnd(22)} | `);
    lLT = crT;
  }

  if (video.paused || video.ended) {
    return;
  }

  requestAnimationFrame(processFrame);
}
