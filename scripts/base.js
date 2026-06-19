UploadVideoHandler = function (event) {
  const file = event.target.files[0];
  if (file) {
    video.src = URL.createObjectURL(file);
    video.load();
  }
}

UploadDitherImageHandler = function (event) {
  const file = event.target.files[0];
  if (file) {
    const img = new Image();
    const tempCanvas = document.createElement("canvas");
    const tempCanvasCtx = tempCanvas.getContext("2d");

    const url = URL.createObjectURL(file);
    img.src = url;

    img.onload = function () {
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;

      tempCanvasCtx.drawImage(img, 0, 0);

      const frame = tempCanvasCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
      const imageData = frame.data;

      const highest = FindHighest(imageData);

      matrixInput = [];
      for (let y = 0; y < tempCanvas.height; y++) {
        const yOffs = y * tempCanvas.height;
        if (!matrixInput[y]) matrixInput[y] = [];

        for (let x = 0; x < tempCanvas.width; x++) {
          matrixInput[y][x] = imageData[(yOffs + x) << 2];
        }
      }

      gId("matrixInput").value = formatNestedArray(matrixInput);
      gId("divisionInput").value = highest + 1;
      divisionInput = highest + 1;
      matrixInputLUTCreate();
    };
  }
}

ChangeCanvasSize = function () {
  const width = Number(document.getElementById("CanvasWidth").value);
  const height = Number(document.getElementById("CanvasHeight").value);

  if (width && height) {
    gCtx.width = width, gCtx.height = height;
    gCtx.canvas.width = gCtx.width, gCtx.canvas.height = gCtx.height;

    ProcessClassMatrix();
  }
}

GenerateBayer = function (size) {
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


BaseInit = function () {
  gCtx.canvas = document.getElementById("canvas");
  gCtx.ctx = gCtx.canvas.getContext("2d", {
    willReadFrequently: true,
    alpha: false,
  });

  document.getElementById("Upload").addEventListener("change",
    function (e) { UploadVideoHandler(e); });

  gCtx.linearLUT = new Float32Array(256);
  for (let i = 0; i < 256; i++) {
    const c = i / 255;
    gCtx.linearLUT[i] = (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4) * 255;
  }

  gCtx.video = document.getElementById("video");
  gCtx.video.addEventListener("play", process);
  gCtx.video.addEventListener("seeking", processFrame);

  RendererInit();
}

document.addEventListener("DOMContentLoaded", BaseInit);
