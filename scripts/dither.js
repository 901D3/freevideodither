
function GenerateBayer(size) {
  let seed = [[0, 2], [3, 1]];

  while (seed.length < size) {
    let n = seed.length;
    let size = n << 1;
    let mat = [];

    for (let x = 0; x < size; x++) {
      mat[x] = [];
      for (let y = 0; y < size; y++) {
        let v = seed[x % n][y % n];
        if (x < n && y < n) mat[x][y] = v * 4;
        else if (x < n && y >= n) mat[x][y] = v * 4 + 2;
        else if (x >= n && y < n) mat[x][y] = v * 4 + 3;
        else mat[x][y] = v * 4 + 1;

      }
    }

    seed = mat;
  }

  return seed;
}

ProcessArithmeticEq = function () { DITHERXYR.ArithmeticFn = new Function('x', 'y', 'v', 'return ' + gctx.primetextarea.value + ';'); };

SetArithmeticDitherPresets = function () {
  const a = document.getElementById('Presets').value;

  let eq = '';

  if (a === 'ArithmeticAddConvariant') eq = '((x + y * 237) * 119 & 255) / 256';
  else if (a === 'ArithmeticXorConvariant') eq = '(((x ^ (y * 149)) * 1234) & 255) / 256';
  else if (a === 'Halftone') eq = '0.5 + 0.5 * Math.sin(0.6 * x) * Math.sin(0.6 * y)';
  else if (a === 'Random') eq = 'Math.random()';
  else return;

  gctx.primetextarea.value = eq;

  DITHERXYR.ArithmeticFn = new Function('x', 'y', 'v', 'return ' + eq + ';');
};

SetOrderedDitherPreset = function () {
  const a = document.getElementById('Presets').value;

  let matrix;

  if (a === 'Threshold') matrix = [[0]];
  else if (a === 'Bayer2') matrix = GenerateBayer(2);
  else if (a === 'Bayer4') matrix = GenerateBayer(4);
  else if (a === 'Bayer8') matrix = GenerateBayer(8);
  else if (a === 'Bayer16') matrix = GenerateBayer(16);
  else if (a === 'Cluster') matrix = [[11, 5, 9, 3], [0, 15, 13, 6], [7, 12, 14, 1], [2, 8, 4, 10]];
  else if (a === 'Fishnet') matrix = [[2, 0, 0, 0, 0, 0, 0, 2], [0, 1, 0, 0, 0, 0, 1, 0], [0, 0, 2, 0, 0, 2, 0, 0], [0, 0, 0, 3, 3, 0, 0, 0], [0, 0, 0, 3, 3, 0, 0, 0], [0, 0, 2, 0, 0, 2, 0, 0], [0, 1, 0, 0, 0, 0, 1, 0], [2, 0, 0, 0, 0, 0, 0, 2]];
  else if (a === 'Halftone') matrix = [[24, 10, 12, 26, 35, 47, 49, 37], [8, 0, 2, 14, 45, 59, 61, 51], [22, 6, 4, 16, 43, 57, 63, 53], [30, 20, 18, 28, 33, 41, 55, 39], [34, 46, 48, 36, 25, 11, 13, 27], [44, 58, 60, 50, 9, 1, 3, 15], [42, 56, 62, 52, 23, 7, 5, 17], [32, 40, 54, 38, 31, 21, 19, 29]];
  else if (a === 'HatchLeft') matrix = [[0, 1, 2, 1], [1, 0, 1, 2], [2, 1, 0, 1], [1, 2, 1, 0]];
  else if (a === 'HatchRight') matrix = [[1, 2, 1, 0], [2, 1, 0, 1], [1, 0, 1, 2], [0, 1, 2, 1]];
  else if (a === 'HatchVertical') matrix = [[0, 1, 2, 1], [0, 1, 2, 1], [0, 1, 2, 1], [0, 1, 2, 1]];
  else if (a === 'HatchHorizontal') matrix = [[0, 0, 0, 0], [1, 1, 1, 1], [2, 2, 2, 2], [1, 1, 1, 1]];
  else if (a === 'CrossHatchLeft') matrix = [[3, 1, 2, 5], [6, 2, 0, 4], [2, 5, 4, 1], [0, 4, 6, 3]];
  else if (a === 'CrossHatchRight') matrix = [[5, 2, 1, 3], [4, 0, 2, 6], [1, 4, 5, 2], [3, 6, 4, 0]];
  else if (a === 'CrossHatchVertical') matrix = [[3, 1, 3, 5], [2, 0, 2, 4]];
  else if (a === 'CrossHatchHorizontal') matrix = [[2, 3], [0, 1], [2, 3], [4, 5]];
  else if (a === 'ZigZag4') matrix = [[1, 0, 0, 1], [0, 1, 1, 0], [1, 2, 2, 1], [2, 1, 1, 2]];
  else if (a === 'ZigZag8') matrix = [[2, 1, 0, 1, 1, 0, 1, 2], [1, 0, 1, 2, 2, 1, 0, 1], [0, 1, 2, 1, 1, 2, 1, 0], [1, 2, 1, 0, 0, 1, 2, 1], [2, 1, 0, 1, 1, 0, 1, 2], [1, 0, 1, 2, 2, 1, 0, 1], [0, 1, 2, 1, 1, 2, 1, 0], [1, 2, 1, 0, 0, 1, 2, 1]];
  else if (a === 'ZigZag16') matrix = [[2, 0, 2, 3, 2, 1, 2, 4, 4, 2, 1, 2, 3, 2, 0, 2], [0, 2, 3, 2, 1, 2, 4, 2, 2, 4, 2, 1, 2, 3, 2, 0], [2, 3, 2, 1, 2, 4, 2, 0, 0, 2, 4, 2, 1, 2, 3, 2], [3, 2, 1, 2, 4, 2, 0, 2, 2, 0, 2, 4, 2, 1, 2, 3], [2, 1, 2, 4, 2, 0, 2, 3, 3, 2, 0, 2, 4, 2, 1, 2], [1, 2, 4, 2, 0, 2, 3, 2, 2, 3, 2, 0, 2, 4, 2, 1], [2, 4, 2, 0, 2, 3, 2, 1, 1, 2, 3, 2, 0, 2, 4, 2], [4, 2, 0, 2, 3, 2, 1, 2, 2, 1, 2, 3, 2, 0, 2, 4], [2, 0, 2, 3, 2, 1, 2, 4, 4, 2, 1, 2, 3, 2, 0, 2], [0, 2, 3, 2, 1, 2, 4, 2, 2, 4, 2, 1, 2, 3, 2, 0], [2, 3, 2, 1, 2, 4, 2, 0, 0, 2, 4, 2, 1, 2, 3, 2], [3, 2, 1, 2, 4, 2, 0, 2, 2, 0, 2, 4, 2, 1, 2, 3], [2, 1, 2, 4, 2, 0, 2, 3, 3, 2, 0, 2, 4, 2, 1, 2], [1, 2, 4, 2, 0, 2, 3, 2, 2, 3, 2, 0, 2, 4, 2, 1], [2, 4, 2, 0, 2, 3, 2, 1, 1, 2, 3, 2, 0, 2, 4, 2], [4, 2, 0, 2, 3, 2, 1, 2, 2, 1, 2, 3, 2, 0, 2, 4]];
  else if (a === 'Dot4') matrix = [[0, 1, 2, 0], [1, 6, 3, 2], [2, 4, 5, 1], [0, 2, 1, 0]];
  else if (a === 'Dot8') matrix = [[0, 0, 1, 1, 1, 1, 0, 0], [0, 1, 2, 2, 2, 2, 1, 0], [1, 2, 2, 3, 3, 2, 2, 1], [1, 2, 3, 4, 4, 3, 2, 1], [1, 2, 3, 4, 4, 3, 2, 1], [1, 2, 2, 3, 3, 2, 2, 1], [0, 1, 2, 2, 2, 2, 1, 0], [0, 0, 1, 1, 1, 1, 0, 0]];
  else if (a === 'Rylander') matrix = [[0, 8, 2, 10], [4, 12, 6, 14], [3, 11, 1, 9], [7, 15, 5, 3]];
  else return;

  gctx.primetextarea.value = FormatNestedArray(matrix);

  {
    let flatMatrix = matrix.flat();
    const div = FindHighest(flatMatrix) + 1;

    ordered.matrix = DITHERXYR.Struct_Matrix();
    ordered.matrix.width = matrix[0].length;
    ordered.matrix.height = matrix.length;
    ordered.matrix.matrix = new Float32Array(ordered.matrix.width * ordered.matrix.height);

    for (let i = ordered.matrix.width * ordered.matrix.height - 1; i >= 0; i--)
      ordered.matrix.matrix[i] = (0.5 + flatMatrix[i]) / div;
  }
};

SetErrorDiffsPreset = function () {
  const a = document.getElementById('Presets').value;

  let matrix;

  if (document.getElementById('Dither').value === 'ErrorDiffusion') {
    if (a === 'FloydSteinberg') matrix = [[0, -1, 7], [3, 5, 1]];
    else if (a === 'FalseFloydSteinberg') matrix = [[-1, 3], [2, 3]];
    else if (a === 'Fan') matrix = [[0, 0, -1, 7], [1, 3, 5, 0]];
    else if (a === 'ShiauFan') matrix = [[0, 0, -1, 4], [1, 1, 2, 0]];
    else if (a === 'ShiauFan2') matrix = [[0, 0, 0, -1, 8], [1, 1, 2, 4, 0]];
    else if (a === 'Atkinson') matrix = [[0, 0, -1, 1, 1], [0, 1, 1, 1, 0], [0, 0, 1, 0, 0]];
    else if (a === 'Burkes') matrix = [[0, 0, -1, 4, 2], [1, 2, 4, 2, 1]];
    else if (a === 'JavisJudiceNinke') matrix = [[0, 0, -1, 7, 5], [3, 5, 7, 5, 3], [1, 3, 5, 3, 1]];
    else if (a === 'Stucki') matrix = [[0, 0, -1, 8, 4], [2, 4, 8, 4, 2], [1, 2, 4, 2, 1]];
    else if (a === 'Sierra') matrix = [[0, 0, -1, 5, 3], [2, 4, 5, 4, 2], [0, 2, 3, 2, 0]];
    else if (a === 'SierraLite') matrix = [[0, -1, 2], [1, 1, 0]];
    else if (a === 'Sierra2') matrix = [[0, 0, -1, 4, 3], [1, 2, 3, 2, 1]];
    else if (a === 'Box') matrix = [[0, -1, 1], [1, 1, 1]];
    else if (a === 'Diagonal') matrix = [[0, -1, 5], [2, 3, 6]];
    else if (a === 'Pigeon') matrix = [[0, 0, -1, 2, 1], [0, 2, 2, 2, 0], [1, 0, 1, 0, 1]];
    else if (a === 'Kist') matrix = [[0, 0, -1, 90, 0], [10, 20, 30, 20, 10], [10, 5, 10, 5, 10]];
    else if (a === 'Arce') matrix = [[0, 0, 0, -1, 32, 0, 0], [6, 13, 10, 19, 10, 18, 8], [0, 0, 12, 26, 12, 0, 0], [3, 6, 4, 8, 4, 7, 2]];
    else if (a === 'Xot') matrix = [[0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 4, 4], [0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7], [0, 0, 0, 0, 0, 0, 0, 0, 4, 7, 7, 7, 7, 4], [0, 0, 0, 0, 0, 0, 0, 0, 4, 7, 7, 7, 7, 4], [0, 0, 2, 2, 0, 0, 3, 3, 0, 7, 8, 8, 7], [0, 3, 3, 3, 5, 6, 5, 5, 5, 7, 5, 5, 4], [2, 3, 3, 3, 7, 6, 5, 5, 4, 6, 1, 1, 1], [2, 3, 3, 3, 7, 6, 5, 5, 4, 6, 1, 1, 1, 1], [0, 3, 3, 3, 5, 6, 5, 5, 5, 5, 1, 1, 1, 1], [0, 0, 2, 2, 0, 0, 3, 3, 0, 0, 0, 1, 1]];
    else if (a === 'TwoD') matrix = [[-1, 1], [1, 0]];
    else if (a === 'OneD') matrix = [[-1, 1]];
    else if (a === 'Knuth') matrix = [[1, 2, 1], [2, -1, 2], [1, 2, 1]];
    else if (a === 'Box3') matrix = [[1, 1, 1], [1, -1, 1], [1, 1, 1]];
    else if (a === 'Box5') matrix = [[1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 1, -1, 1, 1], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1]];
    else if (a === 'Box7') matrix = [[1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1], [1, 1, 1, -1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1]];
    else if (a === 'Box9') matrix = [[1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, -1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1]];
    else if (a === 'Cross') matrix = [[0, 1, 0], [1, -1, 1], [0, 1, 0]];
    else if (a === 'DiagonalCross') matrix = [[1, 0, 1], [0, -1, 0], [1, 0, 1]];
    else return;
  }
  else if (document.getElementById('Dither').value === 'VariableErrorDiffusion') {
    if (a === 'Ostromoukhov') matrix = DiffuseMatrices.Ostromoukhov;
    else if (a === 'ZhouFang') matrix = DiffuseMatrices.ZhouFang;
  }

  gctx.primetextarea.value = FormatNestedArray(matrix);

  ProcessErrorDiffusionMatrices();
};

ProcessErrorDiffusionMatrices = function () {
  errorDiffs.diffskernel = Array.from({ length: 256 }, () => DITHERXYR.Struct_DiffuseKernel());

  const matrix = JSON5.parse(gctx.primetextarea.value);

  const a = document.getElementById('Dither').value

  if (a === 'ErrorDiffusion') {
    const flatMatrix = matrix.flat();

    const width = matrix[0].length;
    const height = matrix.length;
    const centerPos = GetPosition2D(matrix, -1);
    const div = MatrixSum1D(flatMatrix) + 1;

    for (let i = 0; i < 256; i++) {
      const p_kernel = errorDiffs.diffskernel[i];

      p_kernel.weight_count = 0;

      for (let j = 0; j < flatMatrix.length; j++) {
        if (flatMatrix[j] <= 0) continue;
        p_kernel.weight_count++;
      }

      p_kernel.weights = new Float32Array(p_kernel.weight_count * 3);

      for (let j = 0, k = 0; j < flatMatrix.length; j++) {
        if (flatMatrix[j] <= 0) continue;

        const x = j % width;
        const y = Math.floor(j / width);

        p_kernel.weights[k * 3] = flatMatrix[j] / div;
        p_kernel.weights[k * 3 + 1] = x - centerPos[0];
        p_kernel.weights[k * 3 + 2] = y - centerPos[1];
        k++
      }

      p_kernel.width = width;
      p_kernel.height = height;
    }
  }
  else if (a === 'VariableErrorDiffusion') {
    for (let i = 0; i < 256; i++) {
      const p_kernel = errorDiffs.diffskernel[i];
      const p_currmat = matrix[i];

      p_kernel.width = p_currmat[0].length;
      p_kernel.height = p_currmat.length;

      const flatMatrix = p_currmat.flat();
      const div = MatrixSum1D(flatMatrix) + 1;
      const centerPos = GetPosition2D(p_currmat, -1);

      p_kernel.weight_count = 0;
      for (let j = 0; j < flatMatrix.length; j++) {
        if (flatMatrix[j] <= 0) continue;
        p_kernel.weight_count++;
      }

      p_kernel.weights = new Float32Array(p_kernel.weight_count * 3);

      for (let j = 0, k = 0; j < flatMatrix.length; j++) {
        if (flatMatrix[j] <= 0) continue;

        const x = j % p_kernel.width;
        const y = Math.floor(j / p_kernel.width);

        p_kernel.weights[k * 3] = flatMatrix[j] / div;
        p_kernel.weights[k * 3 + 1] = x - centerPos[0];
        p_kernel.weights[k * 3 + 2] = y - centerPos[1];
        k++
      }
    }
  }

  CompileClassMap();
};

CompileClassMap = function () {
  errorDiffs.classMap = DITHERXYR.Struct_ClassMap();

  const a = document.getElementById('Dither').value;

  if (a === 'ErrorDiffusion' || a === 'VariableErrorDiffusion') {
    if (gctx.serpentine) {
      errorDiffs.classMap.width = gctx.canvas.width;
      errorDiffs.classMap.height = gctx.canvas.height;
      errorDiffs.classMap.map = new Int32Array(errorDiffs.classMap.width * errorDiffs.classMap.height);
      errorDiffs.classMap.processed_map = new Int32Array(errorDiffs.classMap.width * errorDiffs.classMap.height * 2);
      errorDiffs.classMap.kernel_transform = new Int32Array(errorDiffs.classMap.width * errorDiffs.classMap.height);

      const p_map = errorDiffs.classMap.map;
      const p_kerneltransf = errorDiffs.classMap.kernel_transform;

      let step = 0;

      for (let y = 0; y < errorDiffs.classMap.height; y++) {
        const row = y * errorDiffs.classMap.width;

        if (y % 2 === 0) {
          for (let x = 0; x < errorDiffs.classMap.width; x++) {
            p_map[row + x] = step++;
            p_kerneltransf[row + x] = 0;
          }
        }
        else {
          for (let x = errorDiffs.classMap.width - 1; x >= 0; x--) {
            p_map[row + x] = step++;
            p_kerneltransf[row + x] = DITHERXYR.KERNEL_TRANSFORM_FLIPX;
          }
        }
      }
    }
    else {
      errorDiffs.classMap.width = 1;
      errorDiffs.classMap.height = 1;
      errorDiffs.classMap.map = new Int32Array([0]);
      errorDiffs.classMap.processed_map = new Int32Array([0, 0]);
      errorDiffs.classMap.kernel_transform = new Int32Array([0]);
    }

    DITHERXYR.ProcessClassMap(errorDiffs.classMap);
  }
};

ProcessPalette = function () {
  palettes.paletter = DITHERXYR.Struct_Palette();
  palettes.paletteg = DITHERXYR.Struct_Palette();
  palettes.paletteb = DITHERXYR.Struct_Palette();

  palettes.paletter.max = palettes.paletteg.max = palettes.paletteb.max = 255;

  palettes.paletter.count = gctx.rCount;
  palettes.paletteg.count = gctx.gCount;
  palettes.paletteb.count = gctx.bCount;

  palettes.paletter.v = new Int32Array(gctx.rCount);
  palettes.paletteg.v = new Int32Array(gctx.gCount);
  palettes.paletteb.v = new Int32Array(gctx.bCount);

  palettes.paletter.lookupcache = new Int32Array(palettes.paletter.max + 1);
  palettes.paletteg.lookupcache = new Int32Array(palettes.paletteg.max + 1);
  palettes.paletteb.lookupcache = new Int32Array(palettes.paletteb.max + 1);

  for (let i = 0; i < gctx.rCount; i++) palettes.paletter.v[i] = Math.floor(i * 255 / (gctx.rCount - 1));
  for (let i = 0; i < gctx.gCount; i++) palettes.paletteg.v[i] = Math.floor(i * 255 / (gctx.gCount - 1));
  for (let i = 0; i < gctx.bCount; i++) palettes.paletteb.v[i] = Math.floor(i * 255 / (gctx.bCount - 1));

  DITHERXYR.ProcessPalette(palettes.paletter);
  DITHERXYR.ProcessPalette(palettes.paletteg);
  DITHERXYR.ProcessPalette(palettes.paletteb);
};


/*
// Improved Dot Diffusion For Image Halftoning
// https://web.archive.org/web/20240720181431/https://apps.dtic.mil/sti/pdfs/ADA368062.pdf

ImproveClassMatrix = function (gray, candidates1, candidates2, sigma) {
  const classHeight = matrixInput.length;
  const classWidth = matrixInput[0].length;

  const sqSz = classWidth * classHeight;

  const kernelArray = BlueNoiseFloat64.getGaussianKernel(sigma);
  const kernelWidth = (Math.ceil(3 * sigma) << 1) + 1;

  const ditheredArray = new Float32Array(sqSz);
  const errorArray = new Float32Array(sqSz);

  ditheredArray.fill(gray);
  dotDiffsClassInputLUTCreateSimple(classWidth, classHeight);
  dotDiffsSimple(ditheredArray, classWidth, classHeight, sqSz);

  for (let i = 0; i < sqSz; i++) {
    errorArray[i] = gray - ditheredArray[i];
  }

  let currentCost = BlueNoiseUtils.computeEnergyWrapAround(
    errorArray,
    classWidth,
    classHeight,
    kernelArray,
    kernelWidth,
    kernelWidth
  );

  let improved = true;

  breaked: while (improved) {
    improved = false;

    for (let candidate1 = 0; candidate1 < candidates1; candidate1++) {
      const candidateIdx1 = (Math.random() * sqSz) | 0;

      for (let candidate2 = 0; candidate2 < candidates2; candidate2++) {
        let candidateIdx2 = (Math.random() * sqSz) | 0;

        while (candidateIdx1 === candidateIdx2) candidateIdx2 = (Math.random() * sqSz) | 0;

        const tmp = dotDiffsClassMatrixCanvasLUT[candidateIdx1];
        dotDiffsClassMatrixCanvasLUT[candidateIdx1] =
          dotDiffsClassMatrixCanvasLUT[candidateIdx2];
        dotDiffsClassMatrixCanvasLUT[candidateIdx2] = tmp;

        ditheredArray.fill(gray);
        dotDiffsSimple(ditheredArray, classWidth, classHeight, sqSz);

        for (let i = 0; i < sqSz; i++) {
          errorArray[i] = gray - ditheredArray[i];
        }

        const cost = BlueNoiseUtils.computeEnergyWrapAround(
          errorArray,
          classWidth,
          classHeight,
          kernelArray,
          kernelWidth,
          kernelWidth
        );

        if (cost > currentCost) {
          currentCost = cost;
          improved = true;

          continue breaked;
        }

        dotDiffsClassMatrixCanvasLUT[candidateIdx2] =
          dotDiffsClassMatrixCanvasLUT[candidateIdx1];
        dotDiffsClassMatrixCanvasLUT[candidateIdx1] = tmp;
      }
    }
  }

  for (let y = 0; y < classHeight; y++) {
    const yOffs = y * classWidth;

    for (let x = 0; x < classWidth; x++) {
      matrixInput[y][x] = dotDiffsClassMatrixCanvasLUT[yOffs + x];
    }
  }
};
*/
 
