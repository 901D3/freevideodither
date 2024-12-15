var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d", { willReadFrequently: true });
var video = document.getElementById("video");
var dropdown = document.getElementById("ditherMethod");
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
