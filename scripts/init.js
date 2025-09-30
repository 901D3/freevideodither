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
var ditherDropdownValue = "none";
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
var _2PI = 2 * PI;

var recorderMimeType;
var recorderCodec;
var recorderFrameRate;
var recorderVideoBitrate;
var recorderWebmWriterQuality;
var isRecording = false;
var isRendering = false;

var canvasWidth = 480;
var canvasHeight = 270;

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
var divisionInput = 1;
var autoDiv;
var arithmeticInput;
var errDiffsMatrixInput = [[-1]];
var errDiffsKernel;
var errDiffsMatrixInputXStart;
var errDiffsMatrixInputYStart;
var errDiffsDivisionInput;
var errDiffsAutoDiv;
var errDiffsBuffer;
var errDiffsBufferTarget;

var varErrDiffsMatrixInput = [[-1], 1];
var varErrDiffsKernel;
var useMirror;

var blueNoiseInitArray;
var blueNoiseWidth = 64;
var blueNoiseHeight = 64;

var setErrDiffsTarget = () => {};
var getBufferValue = () => {};

var getLinear = useLinear ? (val) => linearLUT[val] : (val) => val;
var getBuffer = useBuffer ? (i, c) => errDiffsBuffer[i + c] : () => 0;
var getIndex = useSerpentine
  ? (x, yOffs, y) => ((y & 1 ? canvasWidth - 1 - x : x) + yOffs) << 2
  : (x, yOffs) => (x + yOffs) << 2;

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

function printLog(message, logToConsole, color, flag) {
  let consoleEl = gId("console");
  let maxLogEntries = 500;

  logEntries.push(message);

  if (logEntries.length > maxLogEntries) {
    logEntries.shift();
  }

  let logEntry = document.createElement("span");
  logEntry.innerHTML = message;
  logEntry.style.color = color;
  consoleEl.appendChild(logEntry);
  if (flag === "red") redFlashChangeText(logEntry, 200);
  if (flag === "orange") orangeFlashChangeText(logEntry, 200);
  if (flag === "yellow") yellowFlashChangeText(logEntry, 200);
  if (flag === "grey") greyFlashChangeText(logEntry, 200);

  if (consoleEl.children.length > maxLogEntries) {
    consoleEl.removeChild(consoleEl.firstChild);
  }

  consoleEl.scrollTop = consoleEl.scrollHeight;

  if (logToConsole === 1) {
    console.log(message);
  }
}

function flashChanges(el, fades, time, ...fadeColors) {
  if (!el) return false;

  for (let i = 0; i < fades; i++) {
    setTimeout(() => {
      const stepColor = fadeColors[i % fadeColors.length];
      el.style.backgroundColor = stepColor;
    }, i * time);
  }
}

function redFlashChangeText(el, time) {
  if (!el) return false;

  flashChanges(el, 4, time, "rgba(255, 0, 0, 1)", "rgba(255, 0, 0, 0.6)", "rgba(255, 0, 0, 0.3)", "rgba(255, 0, 0, 0.0)");
}

function orangeFlashChangeText(el, time) {
  if (!el) return false;

  flashChanges(el, 4, time, "rgba(255, 127, 0, 1)", "rgba(255, 127, 0, 0.6)", "rgba(255, 127, 0, 0.3)", "rgba(255, 127, 0, 0)");
}

function yellowFlashChangeText(el, time) {
  if (!el) return false;

  flashChanges(
    el,
    4,
    time,
    "rgba(255, 255, 0, 1)",
    "rgba(255, 255, 0, 0.6)",
    "rgba(255, 255, 0, 0.3)",
    "rgba(255, 255, 0, 0.0)"
  );
}

function greyFlashChangeText(el, time) {
  if (!el) return false;

  flashChanges(
    el,
    4,
    time,
    "rgba(127, 127, 127, 1)",
    "rgba(127, 127, 127, 0.6)",
    "rgba(127, 127, 127, 0.3)",
    "rgba(127, 127, 127, 0)"
  );
}

function RAND(seed) {
  seed = (seed >> (PI * seed)) ^ (seed * 12902091);
  return seed;
}

function mirrorIdx(i, n) {
  if (i < n) return i;
  const j = i - n;
  return n - 1 - j;
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

function lengthRecursive(inArray) {
  let count = 0;

  for (const item of inArray) {
    if (Array.isArray(item)) {
      count += lengthRecursive(item);
    } else {
      count += 1;
    }
  }

  return count;
}

function findHighest(matrix) {
  let result = 0;
  const matrixLength = matrix.length;

  for (let i = 0; i < matrixLength; i++) {
    const v = matrix[i];
    if (v > result) result = v;
  }

  return result;
}

function matrixSum_1D(matrix) {
  let sum = 0;
  const mX = matrix.length;

  for (let i = 0; i < mX; i++) {
    const v = matrix[i];
    if (!isNaN(v) || v !== -1) sum += v;
  }

  return sum;
}

function matrixSum_2D(matrix, exclude) {
  let sum = 0;

  matrix.forEach((row) => {
    row.forEach((v) => {
      if (v != exclude) sum += v;
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

function findStart_3D(matrix, marker) {
  const matrixLength = matrix.length;
  for (let y = 0; y < matrixLength; y++) {
    const matrixYLength = matrix[y].length;
    for (let x = 0; x < matrixYLength; x++) {
      const matrixXLength = matrix[y][x].length;
      for (let z = 0; z < matrixXLength; z++) {
        if (matrix[y][x][z] === marker) {
          return {x, y, z};
        }
      }
    }
  }
}

function noiseArray_1D(width, height, start = 0, end = 255) {
  const sqSz = width * height;
  const range = end - start;
  const array = new Int32Array(sqSz);

  for (let i = 0; i < sqSz; i++) {
    array[i] = start + round(random() * range);
  }

  return array;
}

function unravelIndex(index, shape) {
  const coords = [];

  for (let i = shape.length - 1; i >= 0; i--) {
    coords[i] = index % shape[i];
    index = floor(index / shape[i]);
  }

  return coords;
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
  gId("varErrDiffs").classList.add("disabled");
  gId("matrixThreshDisp").classList.add("disabled");
  gId("blueNoiseDisp").classList.add("disabled");
  gId("arithmeticDisp").classList.add("disabled");
  gId("errDiffsInputDisp").classList.add("disabled");
  gId("varErrDiffsInputDisp").classList.add("disabled");
  gId("lvlsDisp").classList.add("disabled");
  gId("errLvlsDisp").classList.add("disabled");
  gId("linearDisp").classList.add("disabled");
  gId("serpentineDisp").classList.add("disabled");
  gId("bufferDisp").classList.add("disabled");
  gId("mirrorDisp").classList.add("disabled");
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
    gId("lvlsDisp").classList.remove("disabled");
    gId("linearDisp").classList.remove("disabled");
    if (gId("matrix").value === "blueNoise") {
      gId("blueNoiseDisp").classList.remove("disabled");
    }
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
  } else if (dropdownValue === "varErrDiffs") {
    disableAll();
    gId("varErrDiffs").classList.remove("disabled");
    gId("varErrDiffsInputDisp").classList.remove("disabled");
    gId("lvlsDisp").classList.remove("disabled");
    gId("errLvlsDisp").classList.remove("disabled");
    gId("linearDisp").classList.remove("disabled");
    gId("serpentineDisp").classList.remove("disabled");
    gId("bufferDisp").classList.remove("disabled");
    gId("mirrorDisp").classList.remove("disabled");
  }
});
