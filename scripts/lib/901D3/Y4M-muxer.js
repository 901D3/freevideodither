var Y4MMuxer = {
  width: null,
  height: null,
  frameRate: null,

  cache: {
    FRAME: null,
  },

  Init() { },
  WriteHeader() { },
  AppendFrame() { },

  RGBToY() { },
  RGBToU() { },
  RGBToV() { },
};

Y4MMuxer.Init = function (textEncoder) {
  Y4MMuxer.cache.FRAME = textEncoder.encode("FRAME\n");
};

Y4MMuxer.WriteHeader = function (colorSpace, buffer, textEncoder) {
  buffer.push(textEncoder.encode(
    "YUV4MPEG2" +
    " W" + Y4MMuxer.width +
    " H" + Y4MMuxer.height +
    " F" + Y4MMuxer.frameRate + ":1" +
    " Ip " + colorSpace + "\n"));
};

Y4MMuxer.AppendFrame = function (y, u, v, buffer) {
  buffer.push(Y4MMuxer.cache.FRAME);
  buffer.push(new Uint8Array(y));
  buffer.push(new Uint8Array(u));
  buffer.push(new Uint8Array(v));
};

Y4MMuxer.RGBToY = function (r, g, b) { return 0.299 * r + 0.587 * g + 0.114 * b; };
Y4MMuxer.RGBToU = function (r, g, b) { return -0.168736 * r - 0.331264 * g + 0.5 * b + 128; };
Y4MMuxer.RGBToV = function (r, g, b) { return 0.5 * r - 0.418688 * g - 0.081312 * b + 128; };
