//MediaRecorder init

let canvasStream = canvas.captureStream(); //canvas capture speed in fps
let chunks = [];

const option = {
  mimeType: "video/mp4; codec=vp9",
  videoBitsPerSecond: 100000000, //media recorder bitrate
};

const mediaRecorder = new MediaRecorder(
  canvasStream,
  option
);

//Main

mediaRecorder.ondataavailable = (e) => {
  chunks.push(e.data);
};

mediaRecorder.onstop = () => {
  const blob = new Blob(chunks);
  const recordedVideoUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  downloadLink.download = "video.mp4";
  downloadLink.href = recordedVideoUrl;
  printLog(`Download link: ${downloadLink}`);
  downloadLink.click();
  printLog("Saved as webm");
};
