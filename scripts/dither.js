
var SetArithmeticDitherPresets = function () { };

var SetOrderedDitherPreset = function () { };
var CompileOrderedDitherMatrix = function () { };

var SetErrorDiffsPreset = function () { };
var CompileErrorDiffusionMatrices = function () { };
var CompileClassMap = function () { };

var CompileDiffuseTransform = function () { };

var CompilePalette = function () { };

SetArithmeticDitherPresets = function () {
  const a = document.getElementById('Presets').value;

  if (a === 'ArithmeticAddConvariant') arithmetic.fn = function (x, y, v) { return ((x + y * 237) * 119 & 255) / 256; };
  else if (a === 'ArithmeticXorConvariant') arithmetic.fn = function (x, y, v) { return (((x ^ (y * 149)) * 1234) & 255) / 256; };
  else if (a === 'Halftone') arithmetic.fn = function (x, y, v) { return 0.5 + 0.5 * Math.sin(0.8 * x) * Math.sin(0.8 * y); };
  else return;
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

  document.getElementById('PrimeTextarea').value = FormatNestedArray(matrix);

  CompileOrderedDitherMatrix();
};

CompileOrderedDitherMatrix = function () {
  const matrixOrdered = DITHERXYR.Struct_Matrix();
  let matrix = JSON5.parse(document.getElementById('PrimeTextarea').value);
  let flatMatrix = matrix.flat();

  matrixOrdered.width = matrix[0].length;
  matrixOrdered.height = matrix.length;
  matrixOrdered.division = FindHighest(matrix.flat()) + 1;
  matrixOrdered.matrix = new Int32Array(flatMatrix);

  ordered.compiledMatrix = DITHERXYR.Struct_CompiledMatrix();
  ordered.compiledMatrix.matrix = new Float32Array(matrixOrdered.width * matrixOrdered.height);

  DITHERXYR.CompileOrderedDitherMatrix(matrixOrdered, ordered.compiledMatrix);
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
    else if (a === 'OneD') Math.random() > 0.5 ? (matrix = [[-1, 1]]) : (matrix = [[-1], [1]]);
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

  document.getElementById('PrimeTextarea').value = FormatNestedArray(matrix);

  CompileErrorDiffusionMatrices();
};

CompileErrorDiffusionMatrices = function () {
  const kernelList = Array.from({ length: 256 }, () => DITHERXYR.Struct_DiffuseKernel());

  const matrix = JSON5.parse(document.getElementById('PrimeTextarea').value);
  const flatMatrix = matrix.flat();

  const a = document.getElementById('Dither').value

  if (a === 'ErrorDiffusion') {
    const mWidth = matrix[0].length, mHeight = matrix.length;
    const centerPos = GetPosition2D(matrix, -1);
    const div = MatrixSum1D(flatMatrix) + 1;

    for (let i = 0; i < 256; i++) {
      const kernel = kernelList[i];

      kernel.weights = flatMatrix;
      kernel.division = div;

      Vector2Copy(centerPos, kernel.center, 0, 0);

      kernel.dimension[0] = mWidth;
      kernel.dimension[1] = mHeight;
    }
  }
  else if (a === 'VariableErrorDiffusion') {
    for (let i = 0; i < 256; i++) {
      const kernel = kernelList[i];
      const currentMatrix = matrix[i];

      kernel.weights = currentMatrix.flat();
      kernel.division = MatrixSum2D(currentMatrix) + 1;

      Vector2Copy(GetPosition2D(currentMatrix, -1), kernel.center, 0, 0);

      kernel.dimension[0] = currentMatrix[0].length;
      kernel.dimension[1] = currentMatrix.length;
    }
  }

  errorDiffs.compiledDiffuseKernel = Array.from({ length: 256 }, () => DITHERXYR.Struct_CompiledDiffuseKernels());
  for (let i = 0; i < 256; i++) {
    const currentKernel = kernelList[i];
    let weightCount = 0;
    for (let j = currentKernel.dimension[0] * currentKernel.dimension[1] - 1; j >= 0; j--) {
      if (currentKernel.weights[j] > 0) weightCount++;
    }

    const a = errorDiffs.compiledDiffuseKernel[i];

    a.weights = new Float32Array(weightCount);
    a.offsets = new Int32Array(weightCount * 2);
    a.weightCount = weightCount;
  }

  DITHERXYR.CompileDiffuseKernel(kernelList, 256, errorDiffs.compiledDiffuseKernel);

  CompileClassMap();
};

CompileClassMap = function () {
  errorDiffs.classMap = DITHERXYR.Struct_ClassMap();

  const a = document.getElementById('Dither').value;

  if (a === 'ErrorDiffusion' || a === 'VariableErrorDiffusion') {
    if (gCtx.serpentine) {
      errorDiffs.classMap.width = gCtx.width;
      errorDiffs.classMap.height = gCtx.height;
      errorDiffs.classMap.map = new Int32Array(errorDiffs.classMap.width * errorDiffs.classMap.height);

      let step = 0;

      for (let y = 0; y < errorDiffs.classMap.height; y++) {
        const row = y * errorDiffs.classMap.width;
        const isOddRow = (y % 2) === 1;

        if (!isOddRow) {
          for (let x = 0; x < errorDiffs.classMap.width; x++)
            errorDiffs.classMap.map[row + x] = step++;
        }
        else {
          for (let x = errorDiffs.classMap.width - 1; x >= 0; x--)
            errorDiffs.classMap.map[row + x] = step++;
        }
      }
    }
    else {
      errorDiffs.classMap.width = 1;
      errorDiffs.classMap.height = 1;
      errorDiffs.classMap.map = new Int32Array([0]);
    }

    errorDiffs.compiledClassMap = DITHERXYR.Struct_CompiledClassMap();
    errorDiffs.compiledClassMap.classMap = new Int32Array(errorDiffs.classMap.width * errorDiffs.classMap.height);
    errorDiffs.compiledClassMap.compiledClassMap = new Int32Array(errorDiffs.classMap.width * errorDiffs.classMap.height * 2);
    DITHERXYR.CompileClassMap(errorDiffs.classMap, errorDiffs.compiledClassMap);

    CompileDiffuseTransform();
  }
};

CompileDiffuseTransform = function () {
  errorDiffs.compiledClassMap.kernelTransform = new Int32Array(errorDiffs.compiledClassMap.width * errorDiffs.compiledClassMap.height);

  if (gCtx.serpentine) {
    for (let y = 1; y < errorDiffs.compiledClassMap.height; y += 2) {
      const row = y * errorDiffs.compiledClassMap.width;

      for (let x = 0; x < errorDiffs.compiledClassMap.width; x++)
        errorDiffs.compiledClassMap.kernelTransform[row + x] = DITHERXYR.DIFFUSETRANSF_FLIPX;
    }
  }
};

CompilePalette = function () {
  const paletteR = DITHERXYR.Struct_Palette();
  const paletteG = DITHERXYR.Struct_Palette();
  const paletteB = DITHERXYR.Struct_Palette();

  paletteR.paletteMax = paletteG.paletteMax = paletteB.paletteMax = 255;

  paletteR.count = gCtx.rCount;
  paletteG.count = gCtx.gCount;
  paletteB.count = gCtx.bCount;

  paletteR.values = new Int32Array(gCtx.rCount);
  paletteG.values = new Int32Array(gCtx.gCount);
  paletteB.values = new Int32Array(gCtx.bCount);

  palettes.compiledPaletteR = DITHERXYR.Struct_CompiledPalette();
  palettes.compiledPaletteG = DITHERXYR.Struct_CompiledPalette();
  palettes.compiledPaletteB = DITHERXYR.Struct_CompiledPalette();

  palettes.compiledPaletteR.values = new Int32Array(gCtx.rCount);
  palettes.compiledPaletteG.values = new Int32Array(gCtx.gCount);
  palettes.compiledPaletteB.values = new Int32Array(gCtx.bCount);

  palettes.compiledPaletteR.invRanges = new Float32Array(gCtx.rCount - 1);
  palettes.compiledPaletteG.invRanges = new Float32Array(gCtx.gCount - 1);
  palettes.compiledPaletteB.invRanges = new Float32Array(gCtx.bCount - 1);

  palettes.compiledPaletteR.lookup = new Int32Array(paletteR.paletteMax + 1);
  palettes.compiledPaletteG.lookup = new Int32Array(paletteG.paletteMax + 1);
  palettes.compiledPaletteB.lookup = new Int32Array(paletteB.paletteMax + 1);

  for (let i = 0; i < gCtx.rCount; i++)
    paletteR.values[i] = Math.floor(i * 255 / (gCtx.rCount - 1));

  for (let i = 0; i < gCtx.gCount; i++)
    paletteG.values[i] = Math.floor(i * 255 / (gCtx.gCount - 1));

  for (let i = 0; i < gCtx.bCount; i++)
    paletteB.values[i] = Math.floor(i * 255 / (gCtx.bCount - 1));

  DITHERXYR.CompilePalette(paletteR, palettes.compiledPaletteR);
  DITHERXYR.CompilePalette(paletteG, palettes.compiledPaletteG);
  DITHERXYR.CompilePalette(paletteB, palettes.compiledPaletteB);
};

function ToRGBMat(f) {
  let { width, height, data } = f,
    rgbMatrix = [];

  for (let y = 0; y < height; y++) {
    let row = [];
    for (let x = 0; x < width; x++) {
      let i = (y * width + x) << 2,
        cl = data[i];
      row.push(cl);
    }
    rgbMatrix.push(row);
  }

  return rgbMatrix;
}
