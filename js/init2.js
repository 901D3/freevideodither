var startRec = document.getElementById("startRecording");
var stopRec = document.getElementById("stopRecording");
var videoFile;
var ditheredFrames = [];
var isProcessing = false;
var lastUpdateTime = startTime;
var frameCount = 0
var startTime = performance.now();
var lastUpdateTime = startTime;
var lastLogTime = startTime;

video.addEventListener("loadedmetadata", () => {
  adjustCanvasSize();
});
