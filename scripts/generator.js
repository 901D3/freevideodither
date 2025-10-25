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

function blueNoiseWrapper() {
  blueNoiseCanvas.width = blueNoiseWidth;
  blueNoiseCanvas.height = blueNoiseHeight;
  const t0 = performance.now();
  const result = blueNoiseFloat32.voidAndCluster(
    blueNoiseWidth,
    blueNoiseHeight,
    Number(document.getElementById("blueNoisePDSRadiusX").value),
    Number(document.getElementById("blueNoisePDSRadiusY").value),
    Number(document.getElementById("blueNoisePDSKValue").value),
    Number(document.getElementById("blueNoisePhase1Sigma").value),
    Number(document.getElementById("blueNoisePhase2Sigma").value),
    Number(document.getElementById("blueNoisePhase3Sigma").value),
    document.getElementById("blueNoisePhase1Kernel").value != ""
      ? JSON.parse(document.getElementById("blueNoisePhase1Kernel").value)
      : null,
    document.getElementById("blueNoisePhase2Kernel").value != ""
      ? JSON.parse(document.getElementById("blueNoisePhase2Kernel").value)
      : null,
    document.getElementById("blueNoisePhase3Kernel").value != ""
      ? JSON.parse(document.getElementById("blueNoisePhase3Kernel").value)
      : null,
    Number(document.getElementById("blueNoiseCandidateFillingRatio").value),
    blueNoiseInitArray
  );

  printLog("Generating took " + (performance.now() - t0) + "ms");
  const frame = blueNoiseCtx.getImageData(0, 0, blueNoiseWidth, blueNoiseHeight);
  const imageData = frame.data;
  const sqSz = blueNoiseWidth * blueNoiseHeight;
  const sqSz4 = sqSz * 4;
  const denom = (1 / findHighest(result)) * 255;

  for (let i = 0; i < sqSz4; i += 4) imageData[i + 3] = 255;

  for (let y = 0; y < blueNoiseHeight; y++) {
    const yOffs = y * blueNoiseWidth;
    for (let x = 0; x < blueNoiseWidth; x++) {
      let i = yOffs + x;
      let v;
      if (v >= sqSz / 2) {
        v = Math.floor(result[i] * denom);
      } else {
        v = Math.ceil(result[i] * denom);
      }
      i <<= 2;
      imageData[i] = v;
      imageData[i + 1] = v;
      imageData[i + 2] = v;
    }
  }

  matrixInput = [];
  for (let y = 0; y < blueNoiseHeight; y++) {
    const yOffs = y * blueNoiseWidth;
    if (!matrixInput[y]) matrixInput[y] = [];
    for (let x = 0; x < blueNoiseWidth; x++) {
      matrixInput[y][x] = Math.floor(result[yOffs + x]);
    }
  }

  const highest = findHighest(matrixInput.flat()) + 1;
  gId("matrixInput").value = formatNestedArray(matrixInput);
  gId("divisionInput").value = highest;
  divisionInput = highest;
  matrixInputLUTCreate();

  blueNoiseCtx.putImageData(frame, 0, 0);
}
