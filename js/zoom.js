// Zoom − / + for the A4 sheet. Web UI only: progressive enhancement, the control stays hidden without JS.
// Sets --zoom on <html>; css/resume.css applies it to .sheet with the CSS `zoom` property, which re-lays
// out at the new scale like the browser's own zoom (pages can't trigger that one). Remembered per browser.
(function () {
  var LEVELS = [0.5, 0.67, 0.75, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2]; // same steps as browsers' zoom
  var DEFAULT = LEVELS.indexOf(1);
  var STORAGE_KEY = "resume-zoom";

  var control = document.querySelector("[data-zoom]");
  if (!control || !(window.CSS && CSS.supports("zoom", "2"))) return;

  var out = control.querySelector('[data-zoom-step="-1"]');
  var into = control.querySelector('[data-zoom-step="1"]');
  var value = control.querySelector("[data-zoom-reset]");
  var index = DEFAULT;

  try {
    var saved = LEVELS.indexOf(Number(localStorage.getItem(STORAGE_KEY)));
    if (saved !== -1) index = saved;
  } catch (e) {}

  function apply() {
    var level = LEVELS[index];
    document.documentElement.style.setProperty("--zoom", level);
    value.textContent = Math.round(level * 100) + "%";
    out.disabled = index === 0;
    into.disabled = index === LEVELS.length - 1;
    try {
      localStorage.setItem(STORAGE_KEY, level);
    } catch (e) {}
  }

  control.addEventListener("click", function (event) {
    var button = event.target.closest("button");
    if (!button) return;
    if (button.hasAttribute("data-zoom-reset")) index = DEFAULT;
    else index = Math.min(LEVELS.length - 1, Math.max(0, index + Number(button.dataset.zoomStep)));
    apply();
  });

  apply();
  control.hidden = false;
})();
