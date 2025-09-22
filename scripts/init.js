function gId(i) {
  return document.getElementById(i);
}

function gIdV(i) {
  return document.getElementById(i).value;
}

function pFl(i) {
  return parseFloat(i);
}

function pIn(i) {
  return parseInt(i);
}

function lwC(i) {
  return i.toLowerCase();
}

function setDisp(i, s) {
  return (gId(i).style.display = s);
}

let A = 1.7976931348623157e308,
  B = 5e-324;

function hideElements() {
  elementsToHide.forEach((id) => setDisp(id, "none"));
}

var canvas = gId("canvas");
var ctx = canvas.getContext("2d");
var blueNoiseCanvas = gId("blueNoiseCanvas");
var blueNoiseCtx = blueNoiseCanvas.getContext("2d");
var video = gId("video");
var ditherDropdown = gId("dither");
var canvasStream = canvas.captureStream();
var frm = 0;
var stT = 0;
var lsUpdT = 0;
var lLT = 0;
var t = false;
var sqSz;
var {
  floor,
  ceil,
  round,
  trunc,
  sign,
  abs,
  exp,
  log,
  log2,
  log10,
  pow,
  random,
  min,
  max,
  sqrt,
  cbrt,
  sin,
  cos,
  tan,
  asin,
  acos,
  atan,
  atan2,
  sinh,
  cosh,
  tanh,
  asinh,
  acosh,
  atanh,
  E,
  PI,
  SQRT2,
  SQRT1_2,
  LN2,
  LN10,
  LOG2E,
  LOG10E,
} = Math;
var PHI = (1 + sqrt(5)) / 2;

var recorderMimeType;
var recorderCodec;
var recorderFrameRate;
var recorderVideoBitrate;
var recorderWebmWriterQuality;
var isRecording = false;
var isRendering = false;

var canvasWidth = 1280;
var canvasHeight = 720;

var rLvls;
var gLvls;
var bLvls;

var rErrLvls;
var gErrLvls;
var bErrLvls;

var useLinear;
var useSerpentine;
var useBuffer;
var buffer;

var matrixInput = [[1]];
var matrixInputLUT;
var divisionInput;
var autoDiv;
var arithmeticInput;
var errDiffsMatrixInput = [[-1]];
var errDiffsKernel;
var errDiffsMatrixInputXStart;
var errDiffsMatrixInputYStart;
var errDiffsDivisionInput;
var errDiffsAutoDiv;
var errDiffsBuffer;

var frameRate;

ctx.imageSmoothingEnabled = false;

Object.defineProperty(HTMLMediaElement.prototype, "playing", {
  get: function () {
    return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
  },
});

let logEntries = [];

window.addEventListener(
  "touchstart",
  (e) => {
    if (e.touches.length === 1 && (e.touches[0].clientX < 50 || e.touches[0].clientX > window.innerWidth - 50)) {
      e.preventDefault();
    }
  },
  {passive: false}
);

function escapeHTML(str) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function printLog(message) {
  let console = gId("console");
  let maxLogEntries = 500;
  let urlRegex = /https?:\/\/[^\s]+/g;
  let codeRegex = /`([^`]+)`/g;

  let messageWithLinks = escapeHTML(message).replace(urlRegex, function (url) {
    return `<a href="${url}" target="_blank">${url}</a>`;
  });

  messageWithLinks = messageWithLinks.replace(codeRegex, function (_, code) {
    return `<code style="background:#eee;padding:2px 4px;border-radius:4px;font-family:monospace">${code}</code>`;
  });

  logEntries.push(messageWithLinks);

  if (logEntries.length > maxLogEntries) {
    logEntries.shift();
  }

  let logEntry = document.createElement("div");
  logEntry.innerHTML = messageWithLinks + "<br>";
  console.appendChild(logEntry);

  if (console.children.length > maxLogEntries) {
    console.removeChild(console.firstChild);
  }

  console.scrollTop = console.scrollHeight;
}

function RAND(seed) {
  seed = (seed >> (PI * seed)) ^ (seed * 12902091);
  return seed;
}

let linearLUT = new Float32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i / 255;
  linearLUT[i] = (c <= 0.04045 ? c / 12.92 : pow((c + 0.055) / 1.055, 2.4)) * 255;
}

function defV(v1, v2, vx) {
  //v1 for input value, v2 for default value, vx for returning v2 if v1 = vx
  if (isNaN(vx) || !isFinite(vx)) {
    vx = 1;
  }
  if (Number.isNaN(v1) || !isFinite(v1) || v1 === vx) {
    printLog("Returned default value of " + v2);
    return v2;
  } else {
    return v1;
  }
}

function defVAdv(v1, v2, vmin = 0, vmax = 100, ltvmin = false, gtvmax = false) {
  if (Number.isNaN(v1) || !isFinite(v1)) return v2;
  if (ltvmin && v1 < vmin) return v2;
  if (gtvmax && v1 > vmax) return v2;

  return v1;
}

function findHighest(matrix) {
  let highestValue = 0;

  matrix.forEach((row) => {
    row.forEach((v) => {
      if (v > highestValue) {
        highestValue = v;
      }
    });
  });

  return highestValue;
}

function matrixSum(matrix) {
  let sum = 0;

  matrix.forEach((row) => {
    row.forEach((v) => {
      if (!isNaN(v) || v !== -1) sum += v;
    });
  });

  return sum;
}

function findStart_2D(matrix, marker) {
  const matrixLength = matrix.length;
  for (let y = 0; y < matrixLength; y++) {
    const matrixYLength = matrix[y].length;
    for (let x = 0; x < matrixYLength; x++) {
      if (matrix[y][x] === marker) {
        return {x, y};
      }
    }
  }
}

function parseKernel(matrix, division) {
  const start = findStart_2D(matrix, -1);
  const kernel = [];

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      const w = matrix[y][x];
      if (w === -1 || w === 0) continue;

      kernel.push({
        ox: x - start.x,
        oy: y - start.y,
        w: w / division,
      });
    }
  }

  return kernel;
}

function varSync(input, variable, defaultValue) {
  let value = Number(input.value);

  slider.value = defVAdv(value, defaultValue, sliderMin, sliderMax, true, true);
  window[variable] = value;
}

function sliderInputSync(slider, input, variable, defaultValue, source) {
  let value;
  source = source.toLowerCase();

  if (source === "input") {
    value = Number(input.value);
    const sliderMin = Number(slider.min);
    const sliderMax = Number(slider.max);

    if (value >= sliderMin && value <= sliderMax) {
      slider.value = value;
    } else {
      const fixed = defVAdv(value, defaultValue, sliderMin, sliderMax, true, true);
      slider.value = fixed;
    }
  } else if (source === "slider") {
    value = Number(slider.value);
    input.value = value;
  }

  window[variable] = value;
}

let blueNoiseRunning = false;

gId("blueNoiseSeed").value = RAND(random() * 1000);

function blueNoiseGenerate() {
  if (blueNoiseRunning) return;
  blueNoiseRunning = true;
  let width = pIn(gIdV("blueNoiseWidth")),
    height = pIn(gIdV("blueNoiseHeight")),
    seed = pFl(gIdV("blueNoiseSeed")) || random() * 1000,
    maxPoints = pIn(gIdV("blueNoiseMaxPoints")),
    swLoopLimit = pIn(gIdV("blueNoiseSwapLoopLimit")),
    blueNoiseSqSz = width * height;

  blueNoiseCanvas.width = pIn(gIdV("blueNoiseWidth"));
  blueNoiseCanvas.height = pIn(gIdV("blueNoiseHeight"));
  imageData = blueNoiseCtx.getImageData(0, 0, width, height);
  px = imageData.data;

  const t0 = performance.now();
  const blueNoise = blueNoise(pFl(gIdV("blueNoiseSigma")), maxPoints, swLoopLimit, width, height, seed);

  let a = 0;
  for (i = 0; i < blueNoiseSqSz; i++) {
    v = gId("blueNoiseInvertColor").checked
      ? 256 - floor((blueNoise[a++] / blueNoiseSqSz) * 256)
      : floor((blueNoise[a++] / blueNoiseSqSz) * 256);
    p = i * 4;
    px[p] = px[p + 1] = px[p + 2] = v;
    px[p + 3] = 255;
  }

  blueNoiseCtx.putImageData(imageData, 0, 0);
  printLog("Generated in " + (performance.now() - t0) + "ms");
  blueNoiseRunning = false;
}

let bigContainer = document.getElementsByClassName("bigContainer")[0];

if (bigContainer) {
  let observer = new ResizeObserver(() => {
    document.body.style.minWidth = bigContainer.offsetWidth + "px";
  });
  observer.observe(bigContainer);
}

function disableAll() {
  gId("matrix").classList.add("disabled");
  gId("arithmetic").classList.add("disabled");
  gId("errDiffs").classList.add("disabled");
  gId("matrixThreshDisp").classList.add("disabled");
  gId("arithmeticDisp").classList.add("disabled");
  gId("errDiffsInputDisp").classList.add("disabled");
  gId("blueNoiseDisp").classList.add("disabled");
  gId("lvlsDisp").classList.add("disabled");
  gId("errLvlsDisp").classList.add("disabled");
  gId("linearDisp").classList.add("disabled");
  gId("serpentineDisp").classList.add("disabled");
  gId("bufferDisp").classList.add("disabled");
}

gId("useLinear").addEventListener("change", function () {
  useLinear = gId("useLinear").checked;
});

gId("useSerpentine").addEventListener("change", function () {
  useSerpentine = gId("useSerpentine").checked;
});

gId("useBuffer").addEventListener("change", function () {
  useBuffer = gId("useBuffer").checked;
});

gId("dither").addEventListener("change", function () {
  let dropdownValue = gId("dither").value;
  if (dropdownValue === "none") {
    disableAll();
  } else if (dropdownValue === "matrixThreshold") {
    disableAll();
    gId("matrix").classList.remove("disabled");
    gId("matrixThreshDisp").classList.remove("disabled");
    gId("blueNoiseDisp").classList.remove("disabled");
    gId("lvlsDisp").classList.remove("disabled");
    gId("linearDisp").classList.remove("disabled");
  } else if (dropdownValue === "arithmetic") {
    disableAll();
    gId("arithmetic").classList.remove("disabled");
    gId("arithmeticDisp").classList.remove("disabled");
    gId("lvlsDisp").classList.remove("disabled");
    gId("linearDisp").classList.remove("disabled");
  } else if (dropdownValue === "errDiffs") {
    disableAll();
    gId("errDiffs").classList.remove("disabled");
    gId("errDiffsInputDisp").classList.remove("disabled");
    gId("lvlsDisp").classList.remove("disabled");
    gId("errLvlsDisp").classList.remove("disabled");
    gId("linearDisp").classList.remove("disabled");
    gId("serpentineDisp").classList.remove("disabled");
    gId("bufferDisp").classList.remove("disabled");
  }
});
