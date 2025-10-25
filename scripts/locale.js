var locales = {
  none: "None",
  elN_A: "Your browser does not support this element",
  title: "Free Video Dithering",
  subtitle: "A tool for dithering video",

  upload: "Upload",
  paste_link: "Paste link",

  recorder_renderer: "Recorder/Renderer",
  mime_type: "MIME type",
  codec: "Codec",
  file_name: "File name",
  frame_rate: "Frame rate",
  frame_rate_cap: "Frame rate cap",
  bitrate: "Bitrate",

  true: "True",
  false: "False",
  null: "Null",

  blob_quality: "Blob quality",
  enable_file_writer: "Enable file writer",
  max_concurrent_encodes: "Max concurrent encodes",
  start_position: "Start position",

  start: "Start",
  stop: "Stop",
  pause: "Pause",
  resume: "Resume",
  update: "Update",
  play_pause: "Play/Pause",
  auto: "Auto",
  seed: "Seed",
  sigma: "Sigma",
  generate: "Generate",
  invert: "Invert",
  linear: "Linear",
  serpentine: "Serpentine",
  buffer: "Buffer",
  MinDistnc: "Min Distance",
  MaxPts: "Max Points",
  LoopLimit: "Loop Limit",
  PDSInit: "PDS Init",
  RandMat: "Random Matrices",
  mirror: "Mirror",

  video_settings_title: "Video",
  dither_settings_title: "Dither",
  canvas_settings_title: "Canvas",
  width: "Width",
  height: "Height",
  video_speed: "Speed",
  change_canvas_size: "Change canvas size",
  audio_volume: "Volume",
  matrix_thresh: "Matrix Threshhold",
  arithmetic: "Arithmetic",
  err_diffs: "Error Diffusion",
  var_err_diffs: "Variable Error Diffusion",
  canvas_size_change: "Change canvas size",
  pixelated_render: "Pixelated Rendering",
  canvas_desync: "Canvas Desynchronize",
  refresh_canvas: "Refresh canvas",
  canvas_fullscreen: "Canvas Fullscreen",
  threshold: "Threshold",
  bayer: "Bayer",
  checkerboard: "Checkerboard",
  cluster: "Cluster",
  disperseddots1: "Dispersed Dots 1",
  disperseddots2: "Dispersed Dots 2",
  voiddispersed: "Void Dispersed",
  nonrect1: "Non-Rectangular 1",
  nonrect2: "Non-Rectangular 2",
  nonrect3: "Non-Rectangular 3",
  nonrect4: "Non-Rectangular 4",
  hatchright4x4: "Hatch Right",
  hatchleft4x4: "Hatch Left",
  hatchhorizontal4x4: "Hatch Horizontal",
  hatchvertical4x4: "Hatch Vertical",
  kallebach: "Kallebach",
  bluenoise: "Blue Noise",
  arithmetic_add: "Arithmetic Add",
  arithmetic_add_conv: "Arithmetic Add Convariant",
  arithmetic_sub: "Arithmetic Sub",
  arithmetic_sub_conv: "Arithmetic Sub Convariant",
  arithmetic_xor: "Arithmetic Xor",
  arithmetic_xor_conv: "Arithmetic Xor Convariant",
  halftone: "Halftone",
  color_shifted: "Color Shifted",

  Int8Array: "8 Bits Int",
  Int16Array: "16 Bits Int",
  Int32Array: "32 Bits Int",
  Float16Array: "16 Bits Float",
  Float32Array: "32 Bits Float",
  Float64Array: "64 Bits Float",

  telemetry: "Show telemetry(drop fps)",
  //: "",
  //: "",
  //: "",
};

var $locale = (function () {
  function _updText(i, id, newKey) {
    const el = document.querySelector(`[data-text="${i}"][data-text-id="${id}"]`);
    if (!el) return;

    el.setAttribute("data-text", newKey);

    const keyName = newKey.replace(/^\$/, "");
    if (locales[keyName]) {
      el.innerHTML = locales[keyName];
    }
  }
  function _updTextDirty(i, id, newText) {
    const el = document.querySelector(`[data-text="${i}"][data-text-id="${id}"]`);
    if (!el) return;

    el.dataset.text = newText;
    el.innerText = newText;
  }
  return {
    updText: _updText,
    updTextDirty: _updTextDirty,
  };
})();

(function () {
  let keys = Object.keys(locales);

  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];

    let labels = document.querySelectorAll(`[data-text="$${key}"]`);
    if (!labels.length) continue;

    labels.forEach((label) => {
      label.innerText = locales[key];
    });
  }

  gId("console").innerHTML =
    "Check out the source code!\n" +
    "<a href='https://github.com/901D3/freevideodither' target='_blank'>github.com/901D3/freevideodither</a>" +
    "View MP4 codecs to ensure compability for MediaRecorder" +
    "<a href='https://cconcolato.github.io/media-mime-support/' target='_blank'>cconcolato.github.io/media-mime-support/</a>";
})();
