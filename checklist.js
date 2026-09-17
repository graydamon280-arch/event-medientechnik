// Macht Checkboxen in Checklisten antippbar, merkt sich Häkchen und
// Kopf-Felder (Team/Veranstaltung/Datum) lokal im Browser (pro Gerät,
// ohne Server/Login) und zeigt den Fortschritt an.
(function () {
  var list = document.querySelector(".checklist");
  if (!list) return;

  var storageKey = "checklist:" + list.dataset.checklistId;
  var boxes = list.querySelectorAll('.checklist__body input[type="checkbox"]');
  var fields = list.querySelectorAll(".checklist__fields input");
  var progressEl = list.querySelector("[data-checklist-progress]");

  function load() {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || {};
    } catch (e) {
      return {};
    }
  }

  function save(state) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (e) { /* localStorage nicht verfügbar - einfach ignorieren */ }
  }

  var state = load();

  // Kopf-Felder (Team/Veranstaltung/Datum) wiederherstellen und speichern
  fields.forEach(function (field) {
    if (state.fields && state.fields[field.name]) {
      field.value = state.fields[field.name];
    }
    field.addEventListener("input", function () {
      state.fields = state.fields || {};
      state.fields[field.name] = field.value;
      save(state);
    });
  });

  function updateProgress() {
    if (!progressEl) return;
    var visible = Array.prototype.filter.call(boxes, function (box) {
      return box.offsetParent !== null; // per Konfigurator ausgeblendete Punkte nicht mitzählen
    });
    var checked = visible.filter(function (box) { return box.checked; });
    progressEl.textContent = visible.length
      ? checked.length + " von " + visible.length + " erledigt"
      : "";
  }

  state.items = state.items || {};

  boxes.forEach(function (box, i) {
    box.disabled = false; // Kramdown rendert Checkboxen standardmäßig deaktiviert
    var id = "item-" + i;
    box.checked = !!state.items[id];
    box.closest("li").classList.toggle("is-checked", box.checked);

    box.addEventListener("change", function () {
      state.items[id] = box.checked;
      save(state);
      box.closest("li").classList.toggle("is-checked", box.checked);
      updateProgress();
    });
  });

  var resetBtn = document.querySelector("[data-reset-checklist]");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      if (!confirm("Alle Häkchen auf dieser Checkliste zurücksetzen?")) return;
      state.items = {};
      save(state);
      boxes.forEach(function (box) {
        box.checked = false;
        box.closest("li").classList.remove("is-checked");
      });
      updateProgress();
    });
  }

  // Nach einer Modul-Filterung im Konfigurator neu zählen
  document.addEventListener("checklist:recount", updateProgress);

  updateProgress();
})();
