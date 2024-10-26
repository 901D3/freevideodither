function adjustCanvasSize() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  printLog(`Canvas size: ${canvas.width}x${canvas.height}`);
}

function changecanvasSize() {
    let width = document.getElementById("canvasWidth").value;
    let height = document.getElementById("canvasHeight").value;
    let canvas = document.getElementById("canvas");
    if (video.playing) {
      if (width && height) {
        canvas.width = parseInt(width, 10);
        canvas.height = parseInt(height, 10);
      } else {
        alert("The width and height cannot be blank or negative.");
      }
    }
    if (video.paused || video.ended) {
      if (width && height) {
        canvas.width = parseInt(width, 10);
        canvas.height = parseInt(height, 10);
        refreshCanvas();
      } else {
        alert("The width and height cannot be blank or negative.");
      }
    }
  }

  function changeVideoSize() {
    let width = document.getElementById("videoWidth").value;
    let height = document.getElementById("videoHeight").value;
    let video = document.getElementById("video");
    if (width && height) {
      video.width = width;
      video.height = height;
    } else {
      alert("The width and height cannot be blank or negative.");
    }
  }