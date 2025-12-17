const matrixThresholdPresets = () => {
  const a = gId("matrix").value;
  gId("blueNoiseDisp").classList.add("disabled");

  if (a === "threshold") {
    matrixInput = [[1]];
  } else if (a === "bayer2") {
    matrixInput = bayerGen(2);
  } else if (a === "bayer4") {
    matrixInput = bayerGen(4);
  } else if (a === "bayer8") {
    matrixInput = bayerGen(8);
  } else if (a === "bayer16") {
    matrixInput = bayerGen(16);
  } else if (a === "bayer32") {
    matrixInput = bayerGen(32);
  } else if (a === "bayer64") {
    matrixInput = bayerGen(64);
  } else if (a === "bayer128") {
    matrixInput = bayerGen(128);
  } else if (a === "bayer256") {
    matrixInput = bayerGen(256);
  } else if (a === "blueNoise") {
    gId("blueNoiseDisp").classList.remove("disabled");
  } else if (a === "checkerboard") {
    matrixInput = [
      [0, 1],
      [1, 0],
    ];
  } else if (a === "cluster") {
    matrixInput = [
      [11, 5, 9, 3],
      [0, 15, 13, 6],
      [7, 12, 14, 1],
      [2, 8, 4, 10],
    ];
  } else if (a === "fishnet") {
    matrixInput = [
      [2, 0, 0, 0, 0, 0, 0, 2],
      [0, 1, 0, 0, 0, 0, 1, 0],
      [0, 0, 2, 0, 0, 2, 0, 0],
      [0, 0, 0, 3, 3, 0, 0, 0],
      [0, 0, 0, 3, 3, 0, 0, 0],
      [0, 0, 2, 0, 0, 2, 0, 0],
      [0, 1, 0, 0, 0, 0, 1, 0],
      [2, 0, 0, 0, 0, 0, 0, 2],
    ];
  } else if (a === "halftone") {
    matrixInput = [
      [24, 10, 12, 26, 35, 47, 49, 37],
      [8, 0, 2, 14, 45, 59, 61, 51],
      [22, 6, 4, 16, 43, 57, 63, 53],
      [30, 20, 18, 28, 33, 41, 55, 39],
      [34, 46, 48, 36, 25, 11, 13, 27],
      [44, 58, 60, 50, 9, 1, 3, 15],
      [42, 56, 62, 52, 23, 7, 5, 17],
      [32, 40, 54, 38, 31, 21, 19, 29],
    ];
  } else if (a === "cool1") {
    matrixInput = [
      [3, 2, 5, 1],
      [6, 0, 4, 2],
      [2, 4, 1, 5],
      [0, 6, 3, 4],
    ];
  } else if (a === "hatchLeft") {
    matrixInput = [
      [0, 1, 2, 1],
      [1, 0, 1, 2],
      [2, 1, 0, 1],
      [1, 2, 1, 0],
    ];
  } else if (a === "hatchRight") {
    matrixInput = [
      [1, 2, 1, 0],
      [2, 1, 0, 1],
      [1, 0, 1, 2],
      [0, 1, 2, 1],
    ];
  } else if (a === "hatchVertical") {
    matrixInput = [
      [0, 1, 2, 1],
      [0, 1, 2, 1],
      [0, 1, 2, 1],
      [0, 1, 2, 1],
    ];
  } else if (a === "hatchHorizontal") {
    matrixInput = [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [2, 2, 2, 2],
      [1, 1, 1, 1],
    ];
  } else if (a === "crossHatchLeft") {
    matrixInput = [
      [3, 1, 2, 5],
      [6, 2, 0, 4],
      [2, 5, 4, 1],
      [0, 4, 6, 3],
    ];
  } else if (a === "crossHatchRight") {
    matrixInput = [
      [5, 2, 1, 3],
      [4, 0, 2, 6],
      [1, 4, 5, 2],
      [3, 6, 4, 0],
    ];
  } else if (a === "crossHatchVertical") {
    matrixInput = [
      [3, 1, 3, 5],
      [2, 0, 2, 4],
    ];
  } else if (a === "crossHatchHorizontal") {
    matrixInput = [
      [2, 3],
      [0, 1],
      [2, 3],
      [4, 5],
    ];
  } else if (a === "zigZag4") {
    matrixInput = [
      [1, 0, 0, 1],
      [0, 1, 1, 0],
      [1, 2, 2, 1],
      [2, 1, 1, 2],
    ];
  } else if (a === "zigZag8") {
    matrixInput = [
      [2, 1, 0, 1, 1, 0, 1, 2],
      [1, 0, 1, 2, 2, 1, 0, 1],
      [0, 1, 2, 1, 1, 2, 1, 0],
      [1, 2, 1, 0, 0, 1, 2, 1],
      [2, 1, 0, 1, 1, 0, 1, 2],
      [1, 0, 1, 2, 2, 1, 0, 1],
      [0, 1, 2, 1, 1, 2, 1, 0],
      [1, 2, 1, 0, 0, 1, 2, 1],
    ];
  } else if (a === "zigZag16") {
    matrixInput = [
      [2, 0, 2, 3, 2, 1, 2, 4, 4, 2, 1, 2, 3, 2, 0, 2],
      [0, 2, 3, 2, 1, 2, 4, 2, 2, 4, 2, 1, 2, 3, 2, 0],
      [2, 3, 2, 1, 2, 4, 2, 0, 0, 2, 4, 2, 1, 2, 3, 2],
      [3, 2, 1, 2, 4, 2, 0, 2, 2, 0, 2, 4, 2, 1, 2, 3],
      [2, 1, 2, 4, 2, 0, 2, 3, 3, 2, 0, 2, 4, 2, 1, 2],
      [1, 2, 4, 2, 0, 2, 3, 2, 2, 3, 2, 0, 2, 4, 2, 1],
      [2, 4, 2, 0, 2, 3, 2, 1, 1, 2, 3, 2, 0, 2, 4, 2],
      [4, 2, 0, 2, 3, 2, 1, 2, 2, 1, 2, 3, 2, 0, 2, 4],
      [2, 0, 2, 3, 2, 1, 2, 4, 4, 2, 1, 2, 3, 2, 0, 2],
      [0, 2, 3, 2, 1, 2, 4, 2, 2, 4, 2, 1, 2, 3, 2, 0],
      [2, 3, 2, 1, 2, 4, 2, 0, 0, 2, 4, 2, 1, 2, 3, 2],
      [3, 2, 1, 2, 4, 2, 0, 2, 2, 0, 2, 4, 2, 1, 2, 3],
      [2, 1, 2, 4, 2, 0, 2, 3, 3, 2, 0, 2, 4, 2, 1, 2],
      [1, 2, 4, 2, 0, 2, 3, 2, 2, 3, 2, 0, 2, 4, 2, 1],
      [2, 4, 2, 0, 2, 3, 2, 1, 1, 2, 3, 2, 0, 2, 4, 2],
      [4, 2, 0, 2, 3, 2, 1, 2, 2, 1, 2, 3, 2, 0, 2, 4],
    ];
  } else if (a === "dot4") {
    matrixInput = [
      [0, 1, 2, 0],
      [1, 6, 3, 2],
      [2, 4, 5, 1],
      [0, 2, 1, 0],
    ];
  } else if (a === "dot8") {
    matrixInput = [
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [1, 2, 2, 3, 3, 2, 2, 1],
      [1, 2, 3, 4, 4, 3, 2, 1],
      [1, 2, 3, 4, 4, 3, 2, 1],
      [1, 2, 2, 3, 3, 2, 2, 1],
      [0, 1, 2, 2, 2, 2, 1, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
    ];
  } else if (a === "rylander") {
    matrixInput = [
      [0, 8, 2, 10],
      [4, 12, 6, 14],
      [3, 11, 1, 9],
      [7, 15, 5, 3],
    ];
  }

  const highest = findHighest(matrixInput.flat()) + 1;
  gId("matrixInput").value = formatNestedArray(matrixInput);
  gId("divisionInput").value = highest;
  divisionInput = highest;
  matrixInputLUTCreate();

  if (ditherDropdown.value === "dotDiffs") dotDiffsClassInputLUTCreate();
};

const arithmeticPresets = () => {
  const a = gId("arithmetic").value;

  if (a === "arithmeticAdd") {
    arithmeticInput = "(((x + c * 67 + y * 236) * 119) & 255) / 256";
  } else if (a === "arithmeticAddConvariant") {
    arithmeticInput = "((x + y * 237) * 119 & 255) / 256";
  } else if (a === "arithmeticXor") {
    arithmeticInput = "(((x + c * 17) ^ y * 149) * 1234 & 255) / 256";
  } else if (a === "arithmeticXorConvariant") {
    arithmeticInput = "(((x ^ (y * 149)) * 1234) & 255) / 256";
  } else if (a === "halftone") {
    arithmeticInput = "0.5 + 0.5 * sin(0.8 * x) * sin(0.8 * y)";
  } else if (a === "colorShiftedHalftone") {
    arithmeticInput = "0.5 + 0.5 * sin(0.3 * x + 0.4 * c) * sin(0.3 * y + 0.4 * c)";
  }

  gId("arithmeticInput").value = arithmeticInput;
};

const errDiffsPresets = () => {
  const a = gId("errDiffs").value;

  if (a === "floydSteinberg") {
    errDiffsMatrixInput = [
      [0, -1, 7],
      [3, 5, 1],
    ];
  } else if (a === "falseFloydSteinberg") {
    errDiffsMatrixInput = [
      [-1, 3],
      [2, 3],
    ];
  } else if (a === "fan") {
    errDiffsMatrixInput = [
      [0, 0, -1, 7],
      [1, 3, 5],
    ];
  } else if (a === "shiauFan") {
    errDiffsMatrixInput = [
      [0, 0, -1, 4],
      [1, 1, 2],
    ];
  } else if (a === "shiauFan2") {
    errDiffsMatrixInput = [
      [0, 0, 0, -1, 8],
      [1, 1, 2, 4],
    ];
  } else if (a === "atkinson") {
    errDiffsMatrixInput = [
      [0, 0, -1, 1, 1],
      [0, 1, 1, 1],
      [0, 0, 1],
    ];
  } else if (a === "burkes") {
    errDiffsMatrixInput = [
      [0, 0, -1, 4, 2],
      [1, 2, 4, 2, 1],
    ];
  } else if (a === "javisJudiceNinke") {
    errDiffsMatrixInput = [
      [0, 0, -1, 7, 5],
      [3, 5, 7, 5, 3],
      [1, 3, 5, 3, 1],
    ];
  } else if (a === "stucki") {
    errDiffsMatrixInput = [
      [0, 0, -1, 8, 4],
      [2, 4, 8, 4, 2],
      [1, 2, 4, 2, 1],
    ];
  } else if (a === "sierra") {
    errDiffsMatrixInput = [
      [0, 0, -1, 5, 3],
      [2, 4, 5, 4, 2],
      [0, 2, 3, 2],
    ];
  } else if (a === "sierraLite") {
    errDiffsMatrixInput = [
      [0, -1, 2],
      [1, 1],
    ];
  } else if (a === "sierra2") {
    errDiffsMatrixInput = [
      [0, 0, -1, 4, 3],
      [1, 2, 3, 2, 1],
    ];
  } else if (a === "box") {
    errDiffsMatrixInput = [
      [0, -1, 1],
      [1, 1, 1],
    ];
  } else if (a === "diagonal") {
    errDiffsMatrixInput = [
      [0, -1, 5],
      [2, 3, 6],
    ];
  } else if (a === "pigeon") {
    errDiffsMatrixInput = [
      [0, 0, -1, 2, 1],
      [0, 2, 2, 2],
      [1, 0, 1, 0, 1],
    ];
  } else if (a === "kist") {
    errDiffsMatrixInput = [
      [0, 0, -1, 90],
      [10, 20, 30, 20, 10],
      [10, 5, 10, 5, 10],
    ];
  } else if (a === "arce") {
    errDiffsMatrixInput = [
      [0, 0, 0, -1, 32],
      [6, 13, 10, 19, 10, 18, 8],
      [0, 0, 12, 26, 12],
      [3, 6, 4, 8, 4, 7, 2],
    ];
  } else if (a === "xot") {
    errDiffsMatrixInput = [
      [0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 4, 4],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7],
      [0, 0, 0, 0, 0, 0, 0, 0, 4, 7, 7, 7, 7, 4],
      [0, 0, 0, 0, 0, 0, 0, 0, 4, 7, 7, 7, 7, 4],
      [0, 0, 2, 2, 0, 0, 3, 3, 0, 7, 8, 8, 7],
      [0, 3, 3, 3, 5, 6, 5, 5, 5, 7, 5, 5, 4],
      [2, 3, 3, 3, 7, 6, 5, 5, 4, 6, 1, 1, 1],
      [2, 3, 3, 3, 7, 6, 5, 5, 4, 6, 1, 1, 1, 1],
      [0, 3, 3, 3, 5, 6, 5, 5, 5, 5, 1, 1, 1, 1],
      [0, 0, 2, 2, 0, 0, 3, 3, 0, 0, 0, 1, 1],
    ];
  } else if (a === "twoD") {
    errDiffsMatrixInput = [[-1, 1], [1]];
  } else if (a === "oneD") {
    random() > 0.5 ? (errDiffsMatrixInput = [[-1, 1]]) : (errDiffsMatrixInput = [[-1], [1]]);
  } else if (a === "knuth") {
    errDiffsMatrixInput = [
      [1, 2, 1],
      [2, -1, 2],
      [1, 2, 1],
    ];
  }

  errDiffsDivisionInput = matrixSum_2D(errDiffsMatrixInput) + 1;

  gId("errDiffsMatrixInput").value = formatNestedArray(errDiffsMatrixInput);
  gId("errDiffsDivisionInput").value = errDiffsDivisionInput;
  errDiffsKernel = parseKernelErrDiffs(errDiffsMatrixInput, errDiffsDivisionInput);

  if (ditherDropdown.value === "dotDiffs") dotDiffsClassInputLUTCreate();
};

const varErrDiffsPresets = () => {
  const a = gId("varErrDiffs").value;

  if (a === "ostromoukhov") {
    varErrDiffsMatrixInput = varErrDiffsRsrc.ostromoukhov();
  } else if (a === "zhouFang") {
    varErrDiffsMatrixInput = varErrDiffsRsrc.zhouFang();
  }

  gId("varErrDiffsMatrixInput").value = formatNestedArray(varErrDiffsMatrixInput);
  parseKernelVarErrDiffs(varErrDiffsMatrixInput);

  process();
};

function formatNestedArray(arr, indent = 0) {
  const space = "  ".repeat(indent);
  if (!Array.isArray(arr)) return arr;

  const isAllPrimitives = arr.every((item) => !Array.isArray(item));

  if (isAllPrimitives) {
    return `[${arr.join(", ")}]`;
  }

  const items = arr.map((item) => formatNestedArray(item, indent + 1));
  return "[\n" + space + "  " + items.join(",\n" + space + "  ") + "\n" + space + "]";
}

gId("dither").addEventListener("change", () => {
  ditherDropdownValue = gId("dither").value;

  if (ditherDropdown.value === "matrixThreshold") {
    matrixThresholdPresets();
  } else if (ditherDropdown.value === "arithmetic") {
    arithmeticPresets();
  } else if (ditherDropdown.value === "errDiffs") {
    errDiffsPresets();
  } else if (ditherDropdown.value === "varErrDiffs") {
    varErrDiffsPresets();
  } else if (ditherDropdown.value === "dotDiffs") {
    matrixThresholdPresets();
    errDiffsPresets();
  }

  process();
});
gId("matrix").addEventListener("change", matrixThresholdPresets);
gId("arithmetic").addEventListener("change", arithmeticPresets);
gId("errDiffs").addEventListener("change", errDiffsPresets);
gId("varErrDiffs").addEventListener("change", varErrDiffsPresets);
//gId("dotDiffs").addEventListener("change", presets);

function toRGBMat(f) {
  let {width, height, data} = f,
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

function bufferChange(width, height) {
  const sqSz4 = (width * height) << 2;
  const v = gId("buffer").value;

  if (v === "Int8Array") return new Int8Array(sqSz4);
  else if (v === "Int16Array") return new Int16Array(sqSz4);
  else if (v === "Int32Array") return new Int32Array(sqSz4);
  else if (v === "Float16Array") return new Float16Array(sqSz4); //new typed array
  else if (v === "Float32Array") return new Float32Array(sqSz4);
  else if (v === "Float64Array") return new Float32Array(sqSz4);
}

const scaled255 = 1 / 255;

//--------------------------------------------------------------------------------------------------------------------

/**
 * http://caca.zoy.org/study
 */

/**
 * https://en.wikipedia.org/wiki/Ordered_dithering
 */

function bayer(d) {
  const mY = matrixInputLUT.mY;
  const mX = matrixInputLUT.mX;

  for (let c = 0; c < 3; c++) {
    const colorLimit = colorLimitArray[c];
    const colorLimitScaled = (1 / colorLimit) * 255;
    const colorLimitScaled255 = colorLimit * scaled255;

    for (let y = 0; y < canvasHeight; y++) {
      const yOffs = y * canvasWidth;

      for (let x = 0; x < canvasWidth; x++) {
        const i = (x + yOffs) << 2;
        const bVal = matrixInputLUT[(y % mY) * mX + (x % mX)];

        d[i + c] = ((d[i + c] * colorLimitScaled255 + bVal) | 0) * colorLimitScaled;
      }
    }
  }
}

/**
 * Arithmetic dither
 * By Øyvind Kolås
 * https://pippin.gimp.org/a_dither
 *
 * Added "v" variable for current pixel value. Can be used with ternary operator for whatever you want
 */

function arithmetic(d) {
  const cp = new Function("x", "y", "c", "v", "return " + arithmeticInput + ";");

  for (let c = 0; c < 3; c++) {
    const colorLimit = colorLimitArray[c];
    const colorLimitScaled = (1 / colorLimit) * 255;
    const colorLimitScaled255 = colorLimit * scaled255;

    for (let y = 0; y < canvasHeight; y++) {
      const yOffs = y * canvasWidth;

      for (let x = 0; x < canvasWidth; x++) {
        const i = (x + yOffs) << 2;
        const v = d[i + c];

        d[i + c] = ((v * colorLimitScaled255 + cp(x, y, c, v)) | 0) * colorLimitScaled;
      }
    }
  }
}

/**
 * https://en.wikipedia.org/wiki/Error_diffusion
 */

function errDiffs(d) {
  setErrDiffsTarget(d);
  if (useBuffer) errDiffsBuffer.fill(0);

  const errDiffsKernelLength = errDiffsKernelErrIdxX.length;

  for (let c = 0; c < 3; c++) {
    const colorLimit = colorLimitArray[c];
    const colorLimitScaled = (1 / colorLimit) * 255;
    const colorLimitScaled255 = colorLimit * scaled255;
    const el = colorErrArray[c];

    for (let y = 0; y < canvasHeight; y++) {
      const yOffs = y * canvasWidth;
      const isOdd = useSerpentine && y % 2 === 1;

      const xStart = isOdd ? canvasWidth - 1 : 0;
      const xEnd = isOdd ? 0 : canvasWidth;
      const xStep = isOdd ? -1 : 1;

      for (let x = xStart; x !== xEnd; x += xStep) {
        const i = (yOffs + x) << 2;

        const bufferValue = getBufferValue(i, c);
        const cl = d[i + c];

        const result =
          (((cl + bufferValue) * colorLimitScaled255 + 0.5) | 0) * colorLimitScaled;
        const errStrength = (cl - result + bufferValue) * el;

        d[i + c] = result;

        for (let k = 0; k < errDiffsKernelLength; k++) {
          const errIdxX = errDiffsKernelErrIdxX[k];

          const newX = x + (isOdd ? -errIdxX : errIdxX);
          const newY = y + errDiffsKernelErrIdxY[k];

          if (newX < 0) continue;
          else if (newY < 0) continue;
          else if (newX >= canvasWidth) continue;
          else if (newY >= canvasHeight) continue;

          errDiffsBufferTarget[((newY * canvasWidth + newX) << 2) + c] +=
            errStrength * errDiffsKernelErrWeight[k];
        }
      }
    }
  }
}

/**
 * Variable Error Diffusion
 * By Victor Ostromoukhov
 * https://perso.liris.cnrs.fr/ostrom/publications/pdf/SIGGRAPH01_varcoeffED.pdf
 */

function varErrDiffs(d) {
  setErrDiffsTarget(d);
  if (useBuffer) errDiffsBuffer.fill(0);

  for (let c = 0; c < 3; c++) {
    const colorLimit = colorLimitArray[c];
    const colorLimitScaled = (1 / colorLimit) * 255;
    const colorLimitScaled255 = colorLimit * scaled255;
    const el = colorErrArray[c];

    for (let y = 0; y < canvasHeight; y++) {
      const yOffs = y * canvasWidth;
      const isOdd = useSerpentine && y % 2 === 1;

      const xStart = isOdd ? canvasWidth - 1 : 0;
      const xEnd = isOdd ? 0 : canvasWidth;
      const xStep = isOdd ? -1 : 1;

      for (let x = xStart; x !== xEnd; x += xStep) {
        const i = (yOffs + x) << 2;

        const bufferValue = getBufferValue(i, c);
        const cl = d[i + c];
        const {kernelErrIdxX, kernelErrIdxY, kernelErrWeight} = varErrDiffsKernel[cl];

        const result =
          (((cl + bufferValue) * colorLimitScaled255 + 0.5) | 0) * colorLimitScaled;
        const errStrength = (cl - result + bufferValue) * el;

        d[i + c] = result;

        for (let k = kernelErrIdxX.length - 1; k >= 0; k--) {
          const errIdxX = kernelErrIdxX[k];

          const newX = x + (isOdd ? -errIdxX : errIdxX);
          const newY = y + kernelErrIdxY[k];

          if (newX < 0) continue;
          else if (newY < 0) continue;
          else if (newX >= canvasWidth) continue;
          else if (newY >= canvasHeight) continue;

          errDiffsBufferTarget[((newY * canvasWidth + newX) << 2) + c] +=
            errStrength * kernelErrWeight[k];
        }
      }
    }
  }
}

/**
 * Dot Diffusion
 * By Donald E. Knuth
 * https://dl.acm.org/doi/pdf/10.1145/35039.35040
 */

const dotDiffs = (data) => {
  setErrDiffsTarget(data);
  if (useBuffer) errDiffsBuffer.fill(0);

  const errDiffsKernelLength = errDiffsKernelErrIdxX.length;
  const classHeight = matrixInput.length;
  const classWidth = matrixInput[0].length;
  const dotDiffsClassMatrixCanvasLUTLength = dotDiffsClassMatrixCanvasLUT.length;

  for (let c = 0; c < 3; c++) {
    const colorLimit = colorLimitArray[c];
    const colorLimitScaled = (1 / colorLimit) * 255;
    const colorLimitScaled255 = colorLimit * scaled255;
    const el = colorErrArray[c];

    for (let classValue = 0; classValue < dotDiffsClassMatrixCanvasLUTLength; classValue++) {
      const indexesOfClassValueLength = dotDiffsClassMatrixCanvasLUT[classValue].length;

      for (let i = 0; i < indexesOfClassValueLength; i++) {
        const idx = dotDiffsClassMatrixCanvasLUT[classValue][i];

        const x = (idx >> 2) % canvasWidth;
        const y = (idx / (canvasWidth << 2)) | 0;

        const bufferValue = getBufferValue(idx, c);
        const cl = data[idx + c];

        const result =
          (((cl + bufferValue) * colorLimitScaled255 + 0.5) | 0) * colorLimitScaled;
        const errStrength = (cl - result + bufferValue) * el;

        data[idx + c] = result;

        let totalWeight = 0;

        for (let k = 0; k < errDiffsKernelLength; k++) {
          const newX = x + errDiffsKernelErrIdxX[k];
          const newY = y + errDiffsKernelErrIdxY[k];

          if (newX < 0) continue;
          else if (newY < 0) continue;
          else if (newX >= canvasWidth) continue;
          else if (newY >= canvasHeight) continue;
          else if (matrixInput[newY % classHeight][newX % classWidth] <= classValue) continue;

          totalWeight += errDiffsKernelErrWeight[k];
        }

        if (totalWeight !== 0) {
          const scale = errStrength / totalWeight;

          for (let k = 0; k < errDiffsKernelLength; k++) {
            const newX = x + errDiffsKernelErrIdxX[k];
            const newY = y + errDiffsKernelErrIdxY[k];

            if (newX < 0) continue;
            else if (newY < 0) continue;
            else if (newX >= canvasWidth) continue;
            else if (newY >= canvasHeight) continue;
            else if (matrixInput[newY % classHeight][newX % classWidth] <= classValue) continue;

            errDiffsBufferTarget[((newY * canvasWidth + newX) << 2) + c] +=
              errDiffsKernelErrWeight[k] * scale;
          }
        }
      }
    }
  }
};
