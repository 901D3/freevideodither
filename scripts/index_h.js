
var gCtx = {
  video: null,
  speeds: null,

  canvas: null,
  ctx: null,
  width: 480,
  height: 270,

  rCount: 0,
  gCount: 0,
  bCount: 0,

  serpentine: false,
  linear: false,

  linearLUT: null,

  // renderer specific

  exportY4M: false,

  renderStartTime: 0,

  frameRate: 30,

  blobQuality: 0.9,
  isRendering: false,
  renderingPaused: false,

  resumeRenderFn: null,
};

var palettes = {
  compiledPaletteR: null,
  compiledPaletteG: null,
  compiledPaletteB: null,
};
var ordered = {
  matrix: null,
  compiledMatrix: null,
  mWidth: 0,
  mHeight: 0
};
var arithmetic = { fn: null };
var errorDiffs = {
  compiledDiffuseKernel: null,
  diffuseMatrixOffsets: null,

  diffuseTransformMap: null,

  classMap: null,
  compiledClassMap: null,

  fn: {
    DitherErrorDiffusion: null,
    DitherVariableErrorDiffusion: null,
  },
};

var SpeedsInit = function () { };
var SpeedsLog = function () { };

var StartRendering = function () { };
var StopRendering = function () { };
var PauseRendering = function () { };
var ResumeRendering = function () { };
var RendererInit = function () { };

var Render = function () { };
var RenderY4M = function () { };

var Process = function () { };
var ProcessFrame = function () { };

var UploadVideoHandler = function () { };

var UploadDitherImageHandler = function () { };

var WaitForResolve = function () { return new Promise(function (resolve) { resolvePromise = resolve; }); }

var ChangeCanvasSize = function () { };

var GenerateBayer = function (size) { };
var ImproveClassMatrix = function () { };

var BaseInit = function () { };
