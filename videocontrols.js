document.addEventListener("keydown", function (event) {
  if (event.code === "Space") {
    var activeElement = document.activeElement.tagName.toLowerCase();
    if (activeElement !== "input" && activeElement !== "textarea") {
      event.preventDefault();
      togglePlayPause();
    }
  }
});

function togglePlayPause() {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}
function setPlaybackSpeed() {
  var video = document.getElementById("video");
  var speed = document.getElementById("speedInput").value;
  video.playbackRate = parseFloat(speed);
  printLog("Playback speed: " + video.playbackRate);
}

function updateVolumeFromSlider() {
  var volumeSlider = document.getElementById("volumeSlider");
  var volumeInput = document.getElementById("volumeInput");
  var volumeValue = document.getElementById("volumeValue");
  var volume = volumeSlider.value / 100;
  video.volume = volume;
  volumeInput.value = volumeSlider.value;
  volumeValue.textContent = volumeSlider.value;
  printLog("Volume set to: " + video.volume);
}

function updateVolumeFromInput() {
  var volumeInput = document.getElementById("volumeInput");
  var volumeSlider = document.getElementById("volumeSlider");
  var volumeValue = document.getElementById("volumeValue");
  var volume = volumeInput.value;
  if (volume >= 0 && volume <= 100) {
    video.volume = volume / 100;
    volumeSlider.value = volume;
    volumeValue.textContent = volume;
    printLog("Volume set to: " + video.volume);
  }
}

document.addEventListener('keydown', function(event) {
  const activeElement = document.activeElement;
  if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
      switch (event.key) {
          case 'ArrowLeft': // rewind 5 seconds
              event.preventDefault();
              video.currentTime = Math.max(0, video.currentTime - 5);
              break;
          case 'ArrowRight': // fast forward 5 seconds
              event.preventDefault();
              video.currentTime = Math.min(video.duration, video.currentTime + 5);
              break;
          case '0':
              event.preventDefault();
              video.currentTime = 0;
              video.play();
          break;
      }
  }
});
