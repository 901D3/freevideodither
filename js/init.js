var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d", { willReadFrequently: true });
var video = document.getElementById("video");

Object.defineProperty(HTMLMediaElement.prototype, "playing", {
    get: function () {
      return !!(
        this.currentTime > 0 &&
        !this.paused &&
        !this.ended &&
        this.readyState > 2
      );
    },
  });

function processVideo() {
  frm = 0, stT = performance.now(), processFrame()
}