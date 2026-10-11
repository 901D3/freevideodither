
var gctx = {
  video: null,
  speeds: null,
  canvas: null,
  canvas_ctx: null,

  primetextarea: null,

  rCount: 0,
  gCount: 0,
  bCount: 0,

  serpentine: false,
  linear: false,

  linearLUT: null,

  // renderer specific

  render_framerate: 30,

  render_blobquality: 0.9,
  render_isrendering: false,
  render_paused: false,

  render_y4m: false,

  render_resolvepromise: null,
};

var palettes = {
  paletter: null,
  paletteg: null,
  paletteb: null,
};

var ordered = {
  matrix: null,
  matrixwidth: 0,
  matrixheight: 0
};

var arithmetic = { fn: null };

var errorDiffs = {
  diffskernel: null,
  classMap: null,

  fn: {
    DitherErrorDiffusion: null,
    DitherVariableErrorDiffusion: null,
  },
};

//
// base.js
//
var SpeedsInit = function () { };
var SpeedsLog = function () { };
var RendererInit = function () { };
var RenderLoop = function () { };
var RenderFrame = function () { };
var WaitForResolve = function () { return new Promise(function (resolve) { resolvePromise = resolve; }); }

//
// dither.js
//
var SetArithmeticDitherPresets = function () { };
var SetOrderedDitherPreset = function () { };
var SetErrorDiffsPreset = function () { };

var ProcessArithmeticEq = function () { };
var ProcessPalette = function () { };
var ProcessErrorDiffusionMatrices = function () { };

// var ImproveClassMatrix = function () { };
