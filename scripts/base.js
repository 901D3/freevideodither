
SpeedsInit = function () { gctx.speeds.innerText = ''; };
SpeedsLog = function (msg) { gctx.speeds.appendChild(document.createTextNode(msg + '\n')); };

RenderFrame = function () {
  gctx.canvas_ctx.drawImage(gctx.video, 0, 0, gctx.canvas.width, gctx.canvas.height);
  const frame = gctx.canvas_ctx.getImageData(0, 0, gctx.canvas.width, gctx.canvas.height);
  const imageData = frame.data;

  if (gctx.linear)
    for (let i = imageData.length - 1; i >= 0; i--) imageData[i] = gctx.linearLUT[imageData[i]];

  const a = document.getElementById('Dither').value;

  if (a === 'Ordered') {
    DITHERXYR.input_stride = DITHERXYR.output_stride = 4;

    DITHERXYR.input_offset = DITHERXYR.output_offset = 0;
    DITHERXYR.DitherOrdered(imageData, imageData, gctx.canvas.width, gctx.canvas.height, ordered.matrix, palettes.paletter);
    DITHERXYR.input_offset = DITHERXYR.output_offset = 1;
    DITHERXYR.DitherOrdered(imageData, imageData, gctx.canvas.width, gctx.canvas.height, ordered.matrix, palettes.paletteg);
    DITHERXYR.input_offset = DITHERXYR.output_offset = 2;
    DITHERXYR.DitherOrdered(imageData, imageData, gctx.canvas.width, gctx.canvas.height, ordered.matrix, palettes.paletteb);
  }
  else if (a === 'Arithmetic') {
    DITHERXYR.input_stride = DITHERXYR.output_stride = 4;

    DITHERXYR.input_offset = DITHERXYR.output_offset = 0;
    DITHERXYR.DitherArithmetic(imageData, imageData, gctx.canvas.width, gctx.canvas.height, palettes.paletter);
    DITHERXYR.input_offset = DITHERXYR.output_offset = 1;
    DITHERXYR.DitherArithmetic(imageData, imageData, gctx.canvas.width, gctx.canvas.height, palettes.paletteg);
    DITHERXYR.input_offset = DITHERXYR.output_offset = 2;
    DITHERXYR.DitherArithmetic(imageData, imageData, gctx.canvas.width, gctx.canvas.height, palettes.paletteb);
  }
  else if (a === 'ErrorDiffusion') {
    const tileCountX = gctx.canvas.width / errorDiffs.classMap.width;
    const tileCountY = gctx.canvas.height / errorDiffs.classMap.height;

    DITHERXYR.input_stride = DITHERXYR.output_stride = 4;

    DITHERXYR.input_offset = DITHERXYR.output_offset = 0;
    errorDiffs.fn.DitherErrorDiffusion(
      imageData, imageData, null, gctx.canvas.width, gctx.canvas.height,
      errorDiffs.diffskernel,
      errorDiffs.classMap,
      tileCountX, tileCountY,
      palettes.paletter);

    DITHERXYR.input_offset = DITHERXYR.output_offset = 1;
    errorDiffs.fn.DitherErrorDiffusion(
      imageData, imageData, null, gctx.canvas.width, gctx.canvas.height,
      errorDiffs.diffskernel,
      errorDiffs.classMap,
      tileCountX, tileCountY,
      palettes.paletteg);

    DITHERXYR.input_offset = DITHERXYR.output_offset = 2;
    errorDiffs.fn.DitherErrorDiffusion(
      imageData, imageData, null, gctx.canvas.width, gctx.canvas.height,
      errorDiffs.diffskernel,
      errorDiffs.classMap,
      tileCountX, tileCountY,
      palettes.paletteb);
  }
  else if (a === 'VariableErrorDiffusion') {
    const errorBuffer = new Float32Array(gctx.canvas.width * gctx.canvas.height);
    const tileCountX = gctx.canvas.width / errorDiffs.classMap.width;
    const tileCountY = gctx.canvas.height / errorDiffs.classMap.height;

    DITHERXYR.input_stride = DITHERXYR.output_stride = 4;

    DITHERXYR.input_offset = DITHERXYR.output_offset = 0;
    errorDiffs.fn.DitherVariableErrorDiffusion(
      imageData, imageData, errorBuffer, gctx.canvas.width, gctx.canvas.height,
      errorDiffs.diffskernel,
      errorDiffs.classMap,
      tileCountX, tileCountY,
      palettes.paletter);

    DITHERXYR.input_offset = DITHERXYR.output_offset = 1;
    errorBuffer.fill(0);
    errorDiffs.fn.DitherVariableErrorDiffusion(
      imageData, imageData, errorBuffer, gctx.canvas.width, gctx.canvas.height,
      errorDiffs.diffskernel,
      errorDiffs.classMap,
      tileCountX, tileCountY,
      palettes.paletteg);

    DITHERXYR.input_offset = DITHERXYR.output_offset = 2;
    errorBuffer.fill(0);
    errorDiffs.fn.DitherVariableErrorDiffusion(
      imageData, imageData, errorBuffer, gctx.canvas.width, gctx.canvas.height,
      errorDiffs.diffskernel,
      errorDiffs.classMap,
      tileCountX, tileCountY,
      palettes.paletteb);
  }

  gctx.canvas_ctx.putImageData(frame, 0, 0);
}

RenderLoop = function () {
  const t0 = performance.now();

  RenderFrame();
  if (gctx.video.paused || gctx.video.ended) return;

  const time = performance.now() - t0;
  const fps = 1000 / time;

  SpeedsInit();
  SpeedsLog('fps: ' + fps + '/s, ' + time + 'ms');

  setTimeout(RenderLoop, 0);
};

function InitMore() {
  document.getElementById('RCountSlider').addEventListener('input', function () { gctx.rCount = SliderInputSync(document.getElementById('RCountSlider'), document.getElementById('RCountInput'), undefined, 'slider'); ProcessPalette(); });
  document.getElementById('RCountInput').addEventListener('input', function () { gctx.rCount = SliderInputSync(document.getElementById('RCountSlider'), document.getElementById('RCountInput'), 2, 'input'); ProcessPalette(); });
  document.getElementById('GCountSlider').addEventListener('input', function () { gctx.gCount = SliderInputSync(document.getElementById('GCountSlider'), document.getElementById('GCountInput'), undefined, 'slider'); ProcessPalette(); });
  document.getElementById('GCountInput').addEventListener('input', function () { gctx.gCount = SliderInputSync(document.getElementById('GCountSlider'), document.getElementById('GCountInput'), 2, 'input'); ProcessPalette(); });
  document.getElementById('BCountSlider').addEventListener('input', function () { gctx.bCount = SliderInputSync(document.getElementById('BCountSlider'), document.getElementById('BCountInput'), undefined, 'slider'); ProcessPalette(); });
  document.getElementById('BCountInput').addEventListener('input', function () { gctx.bCount = SliderInputSync(document.getElementById('BCountSlider'), document.getElementById('BCountInput'), 2, 'input'); ProcessPalette(); });

  document.getElementById('UseLinear').addEventListener('input', function () { gctx.linear = document.getElementById('UseLinear').checked; });

  document.getElementById('UseSerpentine').addEventListener('input',
    function () {
      gctx.serpentine = document.getElementById('UseSerpentine').checked;

      const a = document.getElementById('Dither').value;
      if (a === 'ErrorDiffusion' || a === 'VariableErrorDiffusion')
        CompileClassMap();
    }
  );

  const ditherPresets = {
    'None': [],

    'Ordered': [
      { value: 'Threshold', label: 'Threshold' },
      { value: 'Bayer2', label: 'Bayer 2x2' },
      { value: 'Bayer4', label: 'Bayer 4x4' },
      { value: 'Bayer8', label: 'Bayer 8x8' },
      { value: 'Bayer16', label: 'Bayer 16x16' },
      { value: 'Cluster', label: 'Cluster' },
      { value: 'Fishnet', label: 'Fishnet' },
      { value: 'Halftone', label: 'Halftone' },
      { value: 'HatchLeft', label: 'Hatch Left' },
      { value: 'HatchRight', label: 'Hatch Right' },
      { value: 'HatchVertical', label: 'Hatch Vertical' },
      { value: 'HatchHorizontal', label: 'Hatch Horizontal' },
      { value: 'CrossHatchLeft', label: 'Cross Hatch Left' },
      { value: 'CrossHatchRight', label: 'Cross Hatch Right' },
      { value: 'CrossHatchVertical', label: 'Cross Hatch Vertical' },
      { value: 'CrossHatchHorizontal', label: 'Cross Hatch Horizontal' },
      { value: 'ZigZag4', label: 'Zig Zag 4' },
      { value: 'ZigZag8', label: 'Zig Zag 8' },
      { value: 'ZigZag16', label: 'Zig Zag 16' },
      { value: 'Dot4', label: 'Dot 4' },
      { value: 'Dot8', label: 'Dot 8' },
      { value: 'Rylander', label: 'Rylander' },
    ],

    'Arithmetic': [
      { value: 'ArithmeticAddConvariant', label: 'Arithmetic ADD Convariant' },
      { value: 'ArithmeticXorConvariant', label: 'Arithmetic XOR Convariant' },
      { value: 'Halftone', label: 'Halftone' },
      { value: 'Random', label: 'Random' },
    ],

    'ErrorDiffusion': [
      { value: 'FloydSteinberg', label: 'Floyd-Steinberg' },
      { value: 'FalseFloydSteinberg', label: 'False Floyd-Steinberg' },
      { value: 'Fan', label: 'Fan' },
      { value: 'ShiauFan', label: 'Shiau-Fan' },
      { value: 'ShiauFan2', label: 'Shiau-Fan 2' },
      { value: 'Atkinson', label: 'Atkinson' },
      { value: 'Burkes', label: 'Burkes' },
      { value: 'JavisJudiceNinke', label: 'Javis Judice Ninke' },
      { value: 'Stucki', label: 'Stucki' },
      { value: 'Sierra', label: 'Sierra' },
      { value: 'SierraLite', label: 'Sierra Lite' },
      { value: 'Sierra2', label: 'Sierra 2' },
      { value: 'Box', label: 'Box' },
      { value: 'Diagonal', label: 'Diagonal' },
      { value: 'Pigeon', label: 'Pigeon' },
      { value: 'Kist', label: 'Kist' },
      { value: 'Arce', label: 'Arce' },
      { value: 'Xot', label: 'Xot' },
      { value: 'TwoD', label: '2D' },
      { value: 'OneD', label: '1D' },
      { value: 'Knuth', label: 'Knuth' },
      { value: 'Box3', label: 'Box 3' },
      { value: 'Box5', label: 'Box 5' },
      { value: 'Box7', label: 'Box 7' },
      { value: 'Box9', label: 'Box 9' },
      { value: 'Cross', label: 'Cross' },
      { value: 'DiagonalCross', label: 'Diagonal Cross' },
    ],

    'VariableErrorDiffusion': [
      { value: 'Ostromoukhov', label: 'Ostromoukhov' },
      { value: 'ZhouFang', label: 'Zhou-Fang' },
    ],
  };

  document.getElementById('Dither').addEventListener('change',
    function () {
      const a = document.getElementById('Presets');

      a.innerHTML = '';

      const b = document.getElementById('Dither').value;

      if (b === 'DotDiffusion') {
        let gr = document.createElement('optgroup');
        gr.label = 'Class Matrix';

        for (const option of ditherPresets['Ordered'])
          gr.appendChild(new Option(option.label, option.value));

        a.appendChild(gr);

        gr = document.createElement('optgroup');
        gr.label = 'Diffuse Matrix';

        for (const option of ditherPresets['ErrorDiffusion'])
          gr.appendChild(new Option(option.label, option.value));

        a.appendChild(gr);
      }
      else {
        for (const option of ditherPresets[b])
          a.add(new Option(option.label, option.value));
      }

      if (b === 'Ordered') SetOrderedDitherPreset();
      else if (b === 'Arithmetic') SetArithmeticDitherPresets();
      else if (b === 'ErrorDiffusion' || b === 'VariableErrorDiffusion') SetErrorDiffsPreset();
    }
  );

  document.getElementById('Presets').addEventListener('change',
    function () {
      const b = document.getElementById('Dither').value;

      if (b === 'Ordered') SetOrderedDitherPreset();
      else if (b === 'Arithmetic') SetArithmeticDitherPresets();
      else if (b === 'ErrorDiffusion' || b === 'VariableErrorDiffusion') SetErrorDiffsPreset();
    }
  );

  gctx.primetextarea.addEventListener('input',
    function () {
      const b = document.getElementById('Dither').value;

      if (b === 'Ordered') CompileOrderedDitherMatrix();
      else if (b === 'Arithmetic') ProcessArithmeticEq();
      else if (b === 'ErrorDiffusion' || b === 'VariableErrorDiffusion') ProcessErrorDiffusionMatrices();
    }
  );

  document.getElementById('CanvasWidth').addEventListener('input', function () { gctx.canvas.width = document.getElementById('CanvasWidth').value; CompileClassMap(); });
  document.getElementById('CanvasHeight').addEventListener('input', function () { gctx.canvas.height = document.getElementById('CanvasHeight').value; CompileClassMap(); });

  document.getElementById('Upload').addEventListener('change',
    function (e) {
      const file = e.target.files[0];
      if (file) {
        gctx.video.src = URL.createObjectURL(file);
        gctx.video.load();
      }
    });

  gctx.video.addEventListener('play', RenderLoop);
  gctx.video.addEventListener('seeking', RenderFrame);


  document.getElementById('ExportY4M').addEventListener('input',
    function () { gctx.exportY4M = document.getElementById('ExportY4M').checked; });

  gctx.rCount = SliderInputSync(document.getElementById('RCountSlider'), document.getElementById('RCountInput'), 2, 'input');
  gctx.gCount = SliderInputSync(document.getElementById('GCountSlider'), document.getElementById('GCountInput'), 2, 'input');
  gctx.bCount = SliderInputSync(document.getElementById('BCountSlider'), document.getElementById('BCountInput'), 2, 'input');

  ProcessPalette();

  useLinear = document.getElementById('UseLinear').checked;
  useSerpentine = document.getElementById('UseSerpentine').checked;
};

function BaseInit() {
  gctx.video = document.getElementById('video');
  gctx.canvas = document.getElementById('canvas');
  gctx.canvas_ctx = gctx.canvas.getContext('2d', { willReadFrequently: true, alpha: false });
  gctx.speeds = document.getElementById('Speeds');
  gctx.primetextarea = document.getElementById('PrimeTextarea');

  RendererInit();

  gctx.linearLUT = new Float32Array(256);
  for (let i = 0; i < 256; i++) {
    const c = i / 255;
    gctx.linearLUT[i] = (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4) * 255;
  }

  errorDiffs.fn.DitherErrorDiffusion = DITHERXYR.CreateDitherErrorDiffusion(true, true);
  errorDiffs.fn.DitherVariableErrorDiffusion = DITHERXYR.CreateDitherErrorDiffusion(false, true);

  InitMore();
}

document.addEventListener('DOMContentLoaded', BaseInit);
