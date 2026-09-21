/* Anton Chernysh — portfolio. No dependencies. */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  /* ---------------------------------------------------------------- theme */
  var STORE = "ac-theme";
  function stored() { try { return localStorage.getItem(STORE); } catch (e) { return null; } }
  function store(v) { try { localStorage.setItem(STORE, v); } catch (e) {} }

  var saved = stored();
  if (saved === "light" || saved === "dark") {
    root.setAttribute("data-theme", saved);
  } else {
    root.setAttribute("data-theme", window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  }

  var themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      store(next);
      var label = "Switch to " + (next === "light" ? "dark" : "light") + " theme";
      themeBtn.setAttribute("aria-label", label);
      themeBtn.setAttribute("title", label);
    });
  }

  /* ------------------------------------------------------------------ nav */
  var menuBtn = document.getElementById("menu-toggle");
  var nav = document.getElementById("primary-nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", open ? "false" : "true");
      menuBtn.setAttribute("aria-expanded", open ? "false" : "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { nav.setAttribute("data-open", "false"); menuBtn.setAttribute("aria-expanded", "false"); }
    });
  }

  /* --------------------------------------------------------------- reveal */
  var revealables = document.querySelectorAll(".reveal");
  if (revealables.length) {
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { entry.target.classList.add("is-in"); io.unobserve(entry.target); }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
      revealables.forEach(function (el) { io.observe(el); });
    } else {
      revealables.forEach(function (el) { el.classList.add("is-in"); });
    }
  }

  /* ---------------------------------------------------------- copy email */
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var value = btn.getAttribute("data-copy");
      var done = function () {
        var old = btn.getAttribute("data-label") || btn.textContent;
        btn.setAttribute("data-label", old);
        btn.textContent = "Copied";
        setTimeout(function () { btn.textContent = old; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done, function () {});
      } else {
        var ta = document.createElement("textarea");
        ta.value = value; document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); done(); } catch (e) {}
        document.body.removeChild(ta);
      }
    });
  });

  /* ----------------------------------------------------------------- year */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ------------------------------------------------------------ carousel */
  var track = document.getElementById("projects-track");
  if (track) {
    var prevBtn = document.getElementById("carousel-prev");
    var nextBtn = document.getElementById("carousel-next");
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var step = function () {
      var card = track.querySelector(".card");
      if (!card) { return track.clientWidth * 0.8; }
      var cs = getComputedStyle(track);
      var gap = parseFloat(cs.columnGap || cs.gap || "16") || 16;
      return card.getBoundingClientRect().width + gap;
    };
    var go = function (dir) {
      track.scrollBy({ left: dir * step(), behavior: reduceMotion ? "auto" : "smooth" });
    };
    var sync = function () {
      var max = track.scrollWidth - track.clientWidth - 1;
      if (prevBtn) { prevBtn.setAttribute("aria-disabled", track.scrollLeft <= 1 ? "true" : "false"); }
      if (nextBtn) { nextBtn.setAttribute("aria-disabled", track.scrollLeft >= max ? "true" : "false"); }
    };

    if (prevBtn) { prevBtn.addEventListener("click", function () { go(-1); }); }
    if (nextBtn) { nextBtn.addEventListener("click", function () { go(1); }); }
    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    });
    track.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    sync();
  }

  /* ------------------------------------------------------------ video cue */
  document.querySelectorAll("video[data-poster-play]").forEach(function (vid) {
    vid.addEventListener("click", function () {
      if (vid.paused) { vid.play(); } else { vid.pause(); }
    });
  });

  /* ----------------------------------------------------------------- deck */
  var deck = document.querySelector("[data-deck]");
  if (!deck) { return; }

  var slides = Array.prototype.slice.call(deck.querySelectorAll(".slide"));
  var counter = document.getElementById("deck-counter");
  var progress = document.getElementById("deck-progress");
  var notes = document.getElementById("deck-notes");
  var noteList = notes ? Array.prototype.slice.call(notes.querySelectorAll("[data-note]")) : [];
  var DECK_STORE = "ac-deck-slide";
  var index = 0;

  function clamp(n) { return Math.max(0, Math.min(slides.length - 1, n)); }

  function show(n, push) {
    index = clamp(n);
    slides.forEach(function (s, i) { s.setAttribute("data-active", i === index ? "true" : "false"); });
    noteList.forEach(function (s, i) { s.hidden = i !== index; });
    if (counter) { counter.textContent = String(index + 1).padStart(2, "0") + " / " + String(slides.length).padStart(2, "0"); }
    if (progress) { progress.style.width = ((index) / Math.max(1, slides.length - 1) * 100) + "%"; }
    try { localStorage.setItem(DECK_STORE, String(index)); } catch (e) {}
    if (push !== false && location.hash !== "#" + (index + 1)) {
      history.replaceState(null, "", "#" + (index + 1));
    }
    var vid = slides[index].querySelector("video");
    deck.querySelectorAll("video").forEach(function (v) { if (v !== vid) { v.pause(); } });
    if (vid && vid.hasAttribute("data-autoplay-slide")) { vid.currentTime = 0; var p = vid.play(); if (p && p.catch) { p.catch(function () {}); } }
  }

  var fromHash = parseInt((location.hash || "").replace("#", ""), 10);
  var saved = NaN;
  try { saved = parseInt(localStorage.getItem(DECK_STORE) || "", 10); } catch (e) {}
  show(!isNaN(fromHash) && fromHash > 0 ? fromHash - 1 : (!isNaN(saved) ? saved : 0), false);

  document.addEventListener("keydown", function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) { return; }
    switch (e.key) {
      case "ArrowRight": case "PageDown": case " ": case "Enter":
        e.preventDefault(); show(index + 1); break;
      case "ArrowLeft": case "PageUp":
        e.preventDefault(); show(index - 1); break;
      case "Home": show(0); break;
      case "End": show(slides.length - 1); break;
      case "n": case "N":
        if (notes) { var open = notes.getAttribute("data-open") === "true"; notes.setAttribute("data-open", open ? "false" : "true"); }
        break;
      case "f": case "F":
        if (!document.fullscreenElement) { if (root.requestFullscreen) { root.requestFullscreen(); } }
        else if (document.exitFullscreen) { document.exitFullscreen(); }
        break;
      case "p": case "P": window.print(); break;
    }
  });

  deck.addEventListener("click", function (e) {
    if (e.target.closest("a, button, video")) { return; }
    var rect = deck.getBoundingClientRect();
    if (e.clientX - rect.left > rect.width * 0.5) { show(index + 1); } else { show(index - 1); }
  });

  var prev = document.getElementById("deck-prev");
  var next = document.getElementById("deck-next");
  var notesBtn = document.getElementById("deck-notes-toggle");
  if (prev) { prev.addEventListener("click", function () { show(index - 1); }); }
  if (next) { next.addEventListener("click", function () { show(index + 1); }); }
  if (notesBtn && notes) {
    notesBtn.addEventListener("click", function () {
      var open = notes.getAttribute("data-open") === "true";
      notes.setAttribute("data-open", open ? "false" : "true");
    });
  }
  window.addEventListener("hashchange", function () {
    var n = parseInt((location.hash || "").replace("#", ""), 10);
    if (!isNaN(n) && n > 0) { show(n - 1, false); }
  });
})();
