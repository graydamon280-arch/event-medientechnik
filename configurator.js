// Steuert den Modul-Konfigurator: blendet vor dem Ausfüllen nur die
// Fragen ein, filtert nach Klick die Checkliste auf die passenden
// Punkte (+ immer sichtbare) und merkt sich die Auswahl in der URL,
// damit eine gefilterte Liste direkt geteilt/gedruckt werden kann.
(function () {
  var configurator = document.querySelector("[data-configurator]");
  if (!configurator) return;

  var checklist = document.querySelector(".checklist");
  checklist.classList.add("has-configurator");

  var checkboxes = configurator.querySelectorAll('input[type="checkbox"]');
  var items = document.querySelectorAll(".checklist__body li[data-module]");
  var phases = document.querySelectorAll(".checklist__phase");

  function getSelected() {
    return Array.prototype.filter
      .call(checkboxes, function (cb) { return cb.checked; })
      .map(function (cb) { return cb.value; });
  }

  function applyFilter(selected) {
    items.forEach(function (li) {
      var tags = (li.dataset.module || "").split(" ");
      var match = tags.indexOf("immer") !== -1 ||
        tags.some(function (t) { return selected.indexOf(t) !== -1; });
      li.classList.toggle("is-hidden", !match);
    });
    phases.forEach(function (section) {
      var visible = section.querySelectorAll("li:not(.is-hidden)").length;
      section.classList.toggle("is-hidden", visible === 0);
    });
  }

  function finishConfiguring() {
    var selected = getSelected();
    applyFilter(selected);
    checklist.classList.add("is-filtered");

    var url = new URL(window.location.href);
    if (selected.length) {
      url.searchParams.set("module", selected.join(","));
    } else {
      url.searchParams.delete("module");
    }
    history.replaceState(null, "", url);
    document.dispatchEvent(new CustomEvent("checklist:recount"));
  }

  function startConfiguring() {
    checklist.classList.remove("is-filtered");
  }

  var submitBtn = configurator.querySelector("[data-configurator-submit]");
  var changeBtn = configurator.querySelector("[data-configurator-change]");
  submitBtn.addEventListener("click", finishConfiguring);
  if (changeBtn) changeBtn.addEventListener("click", startConfiguring);

  // Vorbelegung aus der URL (?module=ton,licht), z.B. für geteilte Links
  var fromUrl = new URLSearchParams(window.location.search).get("module");
  if (fromUrl) {
    var wanted = fromUrl.split(",");
    checkboxes.forEach(function (cb) {
      cb.checked = wanted.indexOf(cb.value) !== -1;
    });
    finishConfiguring();
  }
})();
