function matrixInputLUTCreate() {
  const mY = matrixInput.length;
  const mX = matrixInput[0].length;
  const div = 255 / divisionInput;

  matrixInputLUT = new Float32Array(mY * mX);

  for (let y = 0; y < mY; y++) {
    const yOffs = y * mX;

    for (let x = 0; x < mX; x++) {
      matrixInputLUT[yOffs + x] = (matrixInput[y][x] * div) / 255;
    }
  }

  matrixInputLUT.mY = mY;
  matrixInputLUT.mX = mX;
}

function bayerGen(size) {
  let seed = [
    [0, 2],
    [3, 1],
  ];

  while (seed.length < size) {
    let n = seed.length;
    let size = n << 1;
    let mat = [];

    for (let x = 0; x < size; x++) {
      mat[x] = [];
      for (let y = 0; y < size; y++) {
        let matVal = seed[x % n][y % n];
        if (x < n && y < n) {
          mat[x][y] = matVal * 4;
        } else if (x < n && y >= n) {
          mat[x][y] = matVal * 4 + 2;
        } else if (x >= n && y < n) {
          mat[x][y] = matVal * 4 + 3;
        } else {
          mat[x][y] = matVal * 4 + 1;
        }
      }
    }

    seed = mat;
  }

  return seed;
}

const parseKernelErrDiffs = (matrix, division) => {
  const start = findStart_2D(matrix, -1);
  let count = 0;

  for (let y = matrix.length - 1; y >= 0; y--) {
    for (let x = matrix[y].length - 1; x >= 0; x--) {
      const errWeight = matrix[y][x];
      if (errWeight === -1 || errWeight === 0) continue;

      count++;
    }
  }

  errDiffsKernelErrIdxX = new Int32Array(count);
  errDiffsKernelErrIdxY = new Int32Array(count);
  errDiffsKernelErrWeight = new Float32Array(count);

  let idx = 0;
  for (let y = matrix.length - 1; y >= 0; y--) {
    for (let x = matrix[y].length - 1; x >= 0; x--) {
      let errWeight = matrix[y][x];
      if (errWeight === -1 || errWeight === 0) continue;

      errDiffsKernelErrIdxX[idx] = x - start.x;
      errDiffsKernelErrIdxY[idx] = y - start.y;
      errDiffsKernelErrWeight[idx++] = errWeight / division;
    }
  }
};

const parseKernelVarErrDiffs = (matrix) => {
  const matrixLength = useMirror
    ? matrix.length === 256
      ? matrix.length
      : matrix.length * 2
    : matrix.length;

  varErrDiffsKernel = [];

  for (let i = 0; i < matrixLength; i++) {
    const kernel = useMirror ? matrix[mirrorIdx(i, 128)] : matrix[i];
    const errDiffsKernel = kernel[0];
    const division = kernel[1];

    let count = 0;
    for (let y = errDiffsKernel.length - 1; y >= 0; y--) {
      for (let x = errDiffsKernel[y].length - 1; x >= 0; x--) {
        const errWeight = errDiffsKernel[y][x];
        if (errWeight === -1 || errWeight === 0) continue;

        count++;
      }
    }

    const kernelErrIdxX = new Int32Array(count);
    const kernelErrIdxY = new Int32Array(count);
    const kernelErrWeight = new Float32Array(count);

    const start = findStart_2D(errDiffsKernel, -1);

    let idx = 0;
    for (let y = errDiffsKernel.length - 1; y >= 0; y--) {
      for (let x = errDiffsKernel[y].length - 1; x >= 0; x--) {
        const errWeight = errDiffsKernel[y][x];
        if (errWeight === -1 || errWeight === 0) continue;

        kernelErrIdxX[idx] = x - start.x;
        kernelErrIdxY[idx] = y - start.y;
        kernelErrWeight[idx++] = errWeight / division;
      }
    }

    varErrDiffsKernel.push({
      kernelErrIdxX,
      kernelErrIdxY,
      kernelErrWeight,
    });
  }
};

const dotDiffsClassInputLUTCreate = () => {
  const classHeight = matrixInput.length;
  const classWidth = matrixInput[0].length;

  // Find max/min class values in the clas matrix input
  let minClassValue = Infinity;
  let maxClassValue = -Infinity;

  for (let y = 0; y < classHeight; y++) {
    for (let x = 0; x < classWidth; x++) {
      const v = matrixInput[y][x];

      if (v < minClassValue) minClassValue = v;
      if (v > maxClassValue) maxClassValue = v;
    }
  }

  // Save all available class values, ignore skipped class values
  dotDiffsAvailableClassValues = [];
  for (let i = minClassValue; i <= maxClassValue; i++) {
    let exists = false;

    for (let y = 0; y < classHeight && !exists; y++) {
      for (let x = 0; x < classWidth && !exists; x++) {
        if (matrixInput[y][x] === i) exists = true;
      }
    }

    if (exists) dotDiffsAvailableClassValues.push(i);
  }

  // [classValue][index of the class value tiled on the canvas]
  dotDiffsClassMatrixCanvasLUT = [];
  const classToIndex = [];

  for (let i = 0, length = dotDiffsAvailableClassValues.length; i < length; i++) {
    dotDiffsClassMatrixCanvasLUT[i] = [];
    classToIndex[dotDiffsAvailableClassValues[i]] = i;
  }

  for (let y = 0; y < canvasHeight; y++) {
    const yOffs = y * canvasWidth;
    const classY = y % classHeight;

    for (let x = 0; x < canvasWidth; x++) {
      const classIndex = classToIndex[matrixInput[classY][x % classWidth]];
      if (!dotDiffsClassMatrixCanvasLUT[classIndex]) {
        dotDiffsClassMatrixCanvasLUT[classIndex] = [];
      }

      dotDiffsClassMatrixCanvasLUT[classIndex].push((yOffs + x) << 2);
    }
  }
};

function blueNoiseWrapper() {
  blueNoiseCanvas.width = blueNoiseWidth;
  blueNoiseCanvas.height = blueNoiseHeight;
  let result;

  const sqSz = blueNoiseWidth * blueNoiseHeight;
  const blueNoiseAlgo = gId("blueNoiseAlgo").value;

  const density = Number(document.getElementById("blueNoiseDensity").value);
  const filled1 = (sqSz * density) | 0;
  const sigmaImage = Number(document.getElementById("blueNoiseSigmaImage").value);
  const sigmaSample = Number(document.getElementById("blueNoiseSigmaSample").value);

  const t0 = performance.now();

  BlueNoiseFloat64.gaussianSigmaRadiusMultiplier = Number(
    document.getElementById("blueNoiseGaussianSigmaRadiusMultiplier").value
  );

  BlueNoiseFloat64.useAdaptiveSigmaCandidateAlgo = document.getElementById(
    "blueNoiseUseAdaptiveSigma"
  ).checked;

  BlueNoiseFloat64.initialSigmaScale = Number(
    document.getElementById("blueNoiseInitialSigmaScale").value
  );

  if (blueNoiseAlgo === "extendedVACluster") {
    let kernel = null;

    if (document.getElementById("blueNoiseCustomKernel").value) {
      kernel = JSON.parse(document.getElementById("blueNoiseCustomKernel").value);
    }

    result = BlueNoiseFloat64.extendedVoidAndClusterWrapAround(
      blueNoiseWidth,
      blueNoiseHeight,
      sigmaImage,
      sigmaSample,
      density,
      kernel
    );
  } else if (blueNoiseAlgo === "georgievFajardo") {
    let kernel = null;

    if (document.getElementById("blueNoiseCustomKernel").value) {
      kernel = JSON.parse(document.getElementById("blueNoiseCustomKernel").value);
    }

    result = new Uint32Array(sqSz);
    for (let i = 0; i < sqSz; i++) result[i] = i;

    BlueNoiseFloat64.georgievFajardoWrapAroundInPlace(
      result,
      blueNoiseWidth,
      blueNoiseHeight,
      sigmaImage,
      sigmaSample,
      Number(document.getElementById("blueNoiseIterations").value),
      1,
      kernel
    );
  }

  printLog("Generating took " + (performance.now() - t0) + "ms");

  const highest = findHighest(result);
  const denom = (1 / highest) * 255;

  const frame = blueNoiseCtx.getImageData(0, 0, blueNoiseWidth, blueNoiseHeight);
  const imageData = frame.data;

  for (let y = 0; y < blueNoiseHeight; y++) {
    const yOffs = y * blueNoiseWidth;

    for (let x = 0; x < blueNoiseWidth; x++) {
      let i = yOffs + x;
      const v = Math.round(result[i] * denom);
      i <<= 2;
      imageData[i] = v;
      imageData[i + 1] = v;
      imageData[i + 2] = v;
      imageData[i + 3] = 255;
    }
  }

  blueNoiseCtx.putImageData(frame, 0, 0);

  matrixInput = [];
  for (let y = 0; y < blueNoiseHeight; y++) {
    const yOffs = y * blueNoiseWidth;
    if (!matrixInput[y]) matrixInput[y] = [];

    for (let x = 0; x < blueNoiseWidth; x++) {
      matrixInput[y][x] = result[yOffs + x];
    }
  }

  gId("matrixInput").value = formatNestedArray(matrixInput);
  gId("divisionInput").value = highest + 1;
  divisionInput = highest + 1;
  matrixInputLUTCreate();

  if (ditherDropdown.value === "dotDiffs") dotDiffsClassInputLUTCreate();
}
