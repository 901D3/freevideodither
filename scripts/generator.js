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

function noiseInit(width, height, maxPoints, seed) {
  const sqSz = width * height;
  const indices = new Int8Array(sqSz);

  for (let i = 0; i < maxPoints; i++) indices[i] = 1;

  for (let i = 0; i < sqSz; i++) {
    let j = RAND(floor(RANDD(seed ^ i) * (i + 1)));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  return indices;
}

function PDSInit(width, height, sqSz, minDist, maxPoints, seed) {
  const result = new Uint8Array(sqSz);
  const cellSize = minDist * 0.70710678118;
  const gridWidth = ceil(width / cellSize);
  const gridHeight = ceil(height / cellSize);
  const minDistSq = pow(minDist, 2);
  const grid = new Int32Array(gridWidth * gridHeight).fill(-1);
  const active = [];
  const points = [];
  let activeLength = 0;
  let pointsLength = 0;
  const gridIndex = (x, y) => y * gridWidth + x;
  const insertPoint = (x, y) => {
    const gx = floor(x / cellSize);
    const gy = floor(y / cellSize);
    let idx = gridIndex(gx, gy);
    grid[idx] = points.length;

    points.push({x, y});
    active.push({x, y});
  };

  function inBounds(x, y) {
    x >= 0 && x < width && y >= 0 && y < height;
  }

  function isFarEnough(x, y) {
    const gx = floor(x / cellSize);
    const gy = floor(y / cellSize);

    for (let oy = -2; oy <= 2; oy++) {
      const ny = gy + oy;
      if (ny < 0 || ny >= gridHeight) continue;

      for (let ox = -2; ox <= 2; ox++) {
        const nx = gx + ox;
        if (nx < 0 || nx >= gridWidth) continue;

        const idx = grid[gridIndex(nx, ny)];
        if (idx === -1) continue;

        const pt = points[idx];
        const dx = pt.x - x;
        const dy = pt.y - y;
        if (pow(dx, 2) + pow(dy, 2) < minDistSq) return false;
      }
    }

    return true;
  }

  insertPoint(RAND(seed) * width, RAND(seed) * height);

  activeLength = active.length;
  pointsLength = points.length;
  while (activeLength && pointsLength < maxPoints) {
    const i = (RAND(seed) * activeLength) | 0;
    const baseX = active[i].x;
    const baseY = active[i].y;
    const dist = minDist * (1 + RAND(seed));
    let found = false;

    for (let j = 0; j < 30; j++) {
      const angle = RAND(seed) * 6.28318530718;
      const x = baseX + cos(angle) * dist;
      const y = baseY + sin(angle) * dist;

      if (inBounds(x, y) && isFarEnough(x, y)) {
        insertPoint(x, y);
        found = true;
        break;
      }
    }

    if (!found) {
      active[i] = active[activeLength - 1];
      active.pop();
    }
  }

  for (let i = 0; i < pointsLength - 1; i++) {
    const pt = points[i];
    result[(pt.y | 0) * width + (pt.x | 0)] = 1;
  }

  return result;
}

function blueNoise(sigmaInput, maxPoints, swLoopLimit, width, height, seed) {
  const sqSz = width * height;
  let nrg = new Float32Array(sqSz);
  const widthd2 = width >> 1;
  const heightd2 = height >> 1;
  const maxDist2 = pow(width, 2) + pow(height, 2);
  const expTable = new Float32Array(maxDist2);
  const seeded = RANDDD(seed) << 10;
  const binaryArr = gId("blueNoisePoissonDiskInit").checked
    ? PDSInit(width, height, sqSz, pFl(gIdV("blueNoiseMinDistance")), maxPoints, seeded)
    : noiseInit(width, height, maxPoints, seeded);
  const actualPoints = binaryArr.reduce((sum, val) => sum + val, 0);

  for (let i = 0; i < maxDist2; i++) {
    expTable[i] = exp(i * (-1 / (sigmaInput << 1) ** 2)); //sigma
  }

  function adjNrg(idx, sign) {
    let xa = idx % width,
      ya = (idx / width) | 0;
    for (let i = 0; i < sqSz; i++) {
      let dx = (i % width) - xa,
        dy = ((i / width) | 0) - ya;
      if (abs(dx) > widthd2) dx += dx > 0 ? -width : width;
      if (abs(dy) > heightd2) dy += dy > 0 ? -height : height;
      nrg[i] += sign * expTable[dx * dx + dy * dy];
    }
  }

  maxPoints = min(maxPoints, actualPoints);

  for (let i = 0; i < sqSz; i++) {
    if (binaryArr[i] === 1) {
      adjNrg(i, 1);
    }
  }

  // swapping stage
  while (i++ < swLoopLimit) {
    let bestE = -Infinity,
      bestIdx = -1,
      worstE = Infinity,
      worstIdx = -1;

    for (let j = 0; j < sqSz; j++) {
      if (binaryArr[j] === 1 && nrg[j] > bestE) {
        bestE = nrg[j];
        bestIdx = j;
      }
      if (binaryArr[j] === 0 && nrg[j] < worstE) {
        worstE = nrg[j];
        worstIdx = j;
      }
    }

    if (worstIdx === -1 || bestIdx === worstIdx) break;

    binaryArr[bestIdx] = 0;
    adjNrg(bestIdx, -1);
    binaryArr[worstIdx] = 1;
    adjNrg(worstIdx, 1);
  }

  // rank assignment
  let pR = maxPoints;
  const rk = new Int16Array(sqSz << 2);
  for (let i = 0; i < sqSz; i++) {
    let m1 = -Infinity,
      m2 = Infinity,
      idx1 = -1,
      idx2 = -1;
    for (let j = 0; j < sqSz; j++) {
      if (i < maxPoints && nrg[j] > m1 && binaryArr[i] === 1) {
        m1 = nrg[j];
        idx1 = j;
      }
      if (nrg[j] < m2 && binaryArr[j] === 0) {
        m2 = nrg[j];
        idx2 = j;
      }
    }
    if (i < maxPoints && binaryArr[i] === 1) {
      if (idx1 === -1) break;
      binaryArr[idx1] = 0;
      adjNrg(idx1, -1);
      rk[idx1] = --pR;
    } else {
      if (idx2 === -1) break;
      binaryArr[idx2] = 1;
      adjNrg(idx2, 1);
      rk[idx2] = i;
    }
  }

  return rk;
}
