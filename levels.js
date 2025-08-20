gId("dither").addEventListener("change", function() {
  switch (this.value) {
    case "matrixthreshold":
      hideElements();
      setDisp("lvls", "block");
      setDisp("randMatDisp", "block");
      setDisp("matrixDisp", "block");
      setDisp("bnDisp", "block");
      setDisp("errDiffsDisp", "block");
      setDisp("linearDisp", "block");
      break;
    case "arithmeticcustom":
      hideElements();
      setDisp("lvls", "block");
      setDisp("halftoneLvls", "block");
      setDisp("arithmeticDisp", "block");
      setDisp("arithInput", "block");
      setDisp("linearDisp", "block");
      break;
    case "varerrdiffscustom":
      hideElements();
      setDisp("lvls", "block");
      setDisp("errLvls", "block");
      setDisp("serpentineDisp", "block");
      setDisp("buffDisp", "block");
      setDisp("varerrdiffsDisp", "block");
      setDisp("coeffsInput", "block");
      setDisp("linearDisp", "block");
      if (gId("buff").checked) {
        setDisp("bufferDisp", "block");
      } else {
        setDisp("bufferDisp", "none");
      }
      break;
    case "errdiffscustom":
      hideElements();
      setDisp("lvls", "block");
      setDisp("errLvls", "block");
      setDisp("errorDiffsDisp", "block");
      setDisp("errDiffsDisp", "block");
      setDisp("serpentineDisp", "block");
      setDisp("linearDisp", "block");
      setDisp("buffDisp", "block");
      if (gId("buff").checked) {
        setDisp("bufferDisp", "block");
      } else {
        setDisp("bufferDisp", "none");
      }
      break;
    case "halftone":
      hideElements();
      setDisp("lvls", "block");
      setDisp("halftoneLvls", "block");
      setDisp("linearDisp", "block");
      break;
    case "dotdiffs":
      hideElements();
      setDisp("lvls", "block");
      setDisp("errLvls", "block");
      break;
    default:
      hideElements();
  }
});

//RGB

let colors = ['r', 'g', 'b'];
let cl = ['R', 'G', 'B'];

function sync(i, i2, d) {
  if (d === '0') gId(i2).value = pFl(gIdV(i))
  else if (d === '1') gId(i).value = pFl(gIdV(i2))
}

colors.forEach(colors => {
  gId(`${colors}LvlsRange`).addEventListener('input', () => sync(`${colors}LvlsRange`, `${colors}LvlsInput`, '0'));
  gId(`${colors}LvlsInput`).addEventListener('input', () => sync(`${colors}LvlsRange`, `${colors}LvlsInput`, '1'));
});

cl.forEach((cl) => {
  gId(`${lwC(cl)}ErrLvlsRange`).addEventListener('input', () => sync(`${lwC(cl)}ErrLvlsRange`, `err${cl}`, '0'));
  gId(`err${cl}`).addEventListener('input', () => sync(`${lwC(cl)}ErrLvlsRange`, `err${cl}`, '1'));
});

gId("volumeSlider").addEventListener("input", () => {sync("volumeSlider", "volumeInput", "0")});
gId("volumeInput").addEventListener("input", () => {sync("volumeSlider", "volumeInput", "1")});

gId("bnSigmaRange").addEventListener("input", () => {sync("bnSigmaRange", "bnSigma", "0")});
gId("bnSigma").addEventListener("input", () => {sync("bnSigmaRange", "bnSigma", "1")});

let sliders = ['rLvlsRange', 'gLvlsRange', 'bLvlsRange'];

sliders.forEach(sliderId => {
  let slider = gId(sliderId);
  slider.addEventListener('touchstart', event => event.preventDefault());
  slider.addEventListener('touchmove', event => event.preventDefault());
});

//Slider snapper

function getDivVal(min, max) {
  let divisions = [];
  for (let i = min; i <= max; i++) {
    for (let j = 0; j < 5; j++) {
      divisions.push(i + j * 0.25);
    }
  }
  return divisions;
}

function snap(value, min, max) {
  let closestDivision = getDivVal(min, max).reduce((prev, curr) => {
    return abs(curr - value) < abs(prev - value) ? curr : prev;
  });
  return closestDivision;
}

let shift = false;

window.addEventListener('keydown', (event) => {
  if (event.key === "Shift") shift = true
});

window.addEventListener('keyup', (event) => {
  if (event.key === "Shift") shift = false
});

function handleSliderInput(sliderId) {
  let slider = gId(sliderId);
  let value = pFl(slider.value);
  if (shift) value = snap(value, pFl(slider.min), pFl(slider.max))
  slider.value = value;
  gId(sliderId.replace('Range', 'Input')).value = value;
}

colors.forEach(colors => {
  gId(`${colors}LvlsRange`).addEventListener('input', () => handleSliderInput(`${colors}LvlsRange`));
});