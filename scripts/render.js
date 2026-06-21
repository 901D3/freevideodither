
var startRenderBtn;
var stopRenderBtn;
var pauseRenderBtn;
var resumeRenderBtn;

StartRendering = function () {
  gCtx.isRendering = true;
  gCtx.renderingPaused = false;

  startRenderBtn.setAttribute("disabled", "");
  stopRenderBtn.removeAttribute("disabled", "");

  if (gCtx.exportY4M) RenderY4M();
  else Render();
}

StopRendering = function () {
  gCtx.isRendering = false;
  gCtx.renderingPaused = false;

  startRenderBtn.removeAttribute("disabled", "");
  stopRenderBtn.setAttribute("disabled", "");
  pauseRenderBtn.setAttribute("disabled", "");
  resumeRenderBtn.setAttribute("disabled", "");
}

PauseRendering = function () {
  gCtx.renderingPaused = true;

  pauseRenderBtn.setAttribute("disabled", "");
  resumeRenderBtn.removeAttribute("disabled");
}

ResumeRendering = function () {
  gCtx.renderingPaused = false;

  gCtx.resumeRenderFn();

  pauseRenderBtn.removeAttribute("disabled");
  resumeRenderBtn.setAttribute("disabled", "");
}

RendererInit = function () {
  startRenderBtn = document.getElementById("StartRenderBtn");
  stopRenderBtn = document.getElementById("StopRenderBtn");
  pauseRenderBtn = document.getElementById("PauseRenderBtn");
  resumeRenderBtn = document.getElementById("ResumeRenderBtn");

  startRenderBtn.addEventListener("click", StartRendering);
  stopRenderBtn.addEventListener("click", StopRendering);
  pauseRenderBtn.addEventListener("click", PauseRendering);
  resumeRenderBtn.addEventListener("click", ResumeRendering);

  document.getElementById("RenderBlobQuality").addEventListener("input",
    function () {
      gCtx.blobQuality = document.getElementById("RenderBlobQuality").value;
    }
  );

  gCtx.blobQuality = document.getElementById("RenderBlobQuality").value;
}
