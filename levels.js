document
.getElementById("ditherMethod")
.addEventListener("change", function () {
  let method = this.value;
  if (
    method === "bayer2x2"               ||
    method === "bayer4x4"               ||
    method === "bayer8x8"               ||
    method === "bayer16x16"             ||
    method === "bayer32x32"             ||
    method === "bayer64x64"             ||
    method === "bayer128x128"           ||

    method === "cluster4x4"             ||
    method === "cluster8x8"             ||

    method === "hatchright4x4"          ||
    method === "hatchleft4x4"           ||
    method === "hatchhorizontal4x4"     ||
    method === "hatchvertical4x4"       
  ) {
    document.getElementById("lvls").style.display = "block";
  } else {
    document.getElementById("lvls").style.display = "none";
  }

  if (
    method === "bayer2x2rgb"            ||
    method === "bayer4x4rgb"            ||
    method === "bayer8x8rgb"            ||
    method === "bayer16x16rgb"          ||
    method === "bayer32x32rgb"          ||
    method === "bayer64x64rgb"          ||
    method === "bayer128x128rgb"        ||

    method === "cluster4x4rgb"          ||
    method === "cluster8x8rgb"          ||

    method === "hatchright4x4rgb"       ||
    method === "hatchleft4x4rgb"        ||
    method === "hatchhorizontal4x4rgb"  ||
    method === "hatchvertical4x4rgb"    ||       

    method === "arithmeticaddrgb"       ||
    method === "arithmeticaddconvrgb"   ||
    method === "arithmeticxorrgb"       ||
    method === "arithmeticxorconvrgb"   ||

    method === "floydsteinbergrgb"      ||
    method === "fanrgb"                 ||
    method === "shiaufanrgb"            ||
    method === "shiaufan2rgb"           ||
    
    method === "atkinsonrgb"            ||
    method === "burkesrgb"              ||
    method === "javisjudiceninkergb"    ||
    method === "stuckirgb"              ||

    method === "sierrargb"              ||
    method === "sierralitergb"          ||
    method === "sierra2rgb"             ||
    method === "sierra3rgb"             ||

    method === "twodrgb"

  ) {
    document.getElementById("rgbLvls").style.display = "block";
  } else {
    document.getElementById("rgbLvls").style.display = "none";
  }
});

var grlvls, rLvls, gLvls, bLvls;
var lvlsRange, lvlsInput;

//Grayscale

function updateGrLvlsRange() {
  lvlsRange = document.getElementById("grLvlsRange");
  var lvlsInput = document.getElementById("grLvlsInput");
  lvlsInput.value = lvlsRange.value;
}

function updateGrLvlsInput() {
  lvlsInput = document.getElementById("grLvlsInput");
  var lvlsRange = document.getElementById("grLvlsRange");
  lvls = parseFloat(lvlsInput.value);
  lvlsRange.value = lvls;

  if (lvls > 1) {
      lvlsRange.max = 255;
      lvlsRange.value = Math.min(lvlsRange.value, 255);
  } else {
      lvlsRange.max = 1;
      lvlsRange.value = Math.min(lvlsRange.value, 1);
  }
  
}

//RGB

const colors = ['r', 'g', 'b'];

function updateLvlsRange(color) {
  const slider = document.getElementById(`${color}LvlsRange`);
  const value = parseFloat(slider.value);
  slider.value = value;
  document.getElementById(`${color}LvlsInput`).value = value;
}

function updateLvlsInput(color) {
  const range = document.getElementById(`${color}LvlsRange`);
  const input = document.getElementById(`${color}LvlsInput`);
  const lvls = parseFloat(input.value);

  if (lvls > 1) {
    range.max = 255;
    range.value = Math.min(range.value, 255);
  } else {
    range.max = 1;
    range.value = Math.min(range.value, 1);
  }

  range.value = lvls;
}

colors.forEach(color => {
  // Update sliders and inputs
  document.getElementById(`${color.toLowerCase()}LvlsRange`).addEventListener('input', () => updateLvlsRange(color.toLowerCase()));
  document.getElementById(`${color.toLowerCase()}LvlsInput`).addEventListener('input', () => updateLvlsInput(color.toLowerCase()));
});

// Prevent touch events on sliders
const sliders = ['grLvlsRange', 'rLvlsRange', 'gLvlsRange', 'bLvlsRange'];

sliders.forEach(sliderId => {
  const slider = document.getElementById(sliderId);
  slider.addEventListener('touchstart', event => event.preventDefault());
  slider.addEventListener('touchmove', event => event.preventDefault());
});

//Slider snapper

function getDivisionValues(min, max) {
  const divisions = [];
  for (let i = min; i <= max; i++) {
    for (let j = 0; j < 5; j++) {
      divisions.push(i + j * 0.25);
    }
  }
  return divisions;
}

function snap(value, min, max) {
  const divisions = getDivisionValues(min, max);
  let closestDivision = divisions.reduce((prev, curr) => {
    return Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev;
  });
  return closestDivision;
}

let shiftPressed = false;

window.addEventListener('keydown', function (event) {
  if (event.key === "Shift") {
    shiftPressed = true;
  }
});

window.addEventListener('keyup', function (event) {
  if (event.key === "Shift") {
    shiftPressed = false;
  }
});

function handleSliderInput(sliderId) {
  const slider = document.getElementById(sliderId);
  const min = parseFloat(slider.min);
  const max = parseFloat(slider.max);
  let value = parseFloat(slider.value);

  if (shiftPressed) {
    value = snap(value, min, max);
  }

  slider.value = value;
  document.getElementById(sliderId.replace('Range', 'Input')).value = value;
}

document.getElementById('grLvlsRange').addEventListener('input', () => handleSliderInput('grLvlsRange'));
document.getElementById('rLvlsRange').addEventListener('input', () => handleSliderInput('rLvlsRange'));
document.getElementById('gLvlsRange').addEventListener('input', () => handleSliderInput('gLvlsRange'));
document.getElementById('bLvlsRange').addEventListener('input', () => handleSliderInput('bLvlsRange'));

document.getElementById('grLvlsRange').addEventListener('dblclick', () => {
  const lvlslider = document.getElementById('grLvlsRange');
  const min = parseFloat(lvlslider.min);
  const max = parseFloat(lvlslider.max);
  const value = parseFloat(lvlslider.value);
  const snapped = snap(value, min, max);
  lvlslider.value = snapped;
  document.getElementById('grLvlsInput').value = snapped;
});

document.getElementById('rLvlsRange').addEventListener('dblclick', () => {
  const min = parseFloat(redSlider.min);
  const max = parseFloat(redSlider.max);
  const value = parseFloat(redSlider.value);
  const snapped = snap(value, min, max);
  redSlider.value = snapped;
  document.getElementById('rLvlsInput').value = snapped;
});

document.getElementById('gLvlsRange').addEventListener('dblclick', () => {
  const min = parseFloat(greenSlider.min);
  const max = parseFloat(greenSlider.max);
  const value = parseFloat(greenSlider.value);
  const snapped = snap(value, min, max);
  greenSlider.value = snapped;
  document.getElementById('gLvlsInput').value = snapped;
});

document.getElementById('bLvlsRange').addEventListener('dblclick', () => {
  const min = parseFloat(blueSlider.min);
  const max = parseFloat(blueSlider.max);
  const value = parseFloat(blueSlider.value);
  const snapped = snap(value, min, max);
  blueSlider.value = snapped;
  document.getElementById('bLvlsInput').value = snapped;
});

document
  .getElementById("ditherMethod")
  .addEventListener("change", function () {
    let method = this.value;
    if (method === "random" || method === "randomrgb") {
      document.getElementById("noiseSettings").style.display = "block";
    } else {
      document.getElementById("noiseSettings").style.display = "none";
    }
  });




