/* Anton Chernysh — portfolio. No dependencies. */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  /* ---------------------------------------------------------------- theme */
  var STORE = "ac-theme";
  function stored() { try { return localStorage.getItem(STORE); } catch (e) { return null; } }
  function store(v) { try { localStorage.setItem(STORE, v); } catch (e) {} }

  /* dark is the default: the stored choice wins, otherwise stay dark */
  var saved = stored();
  root.setAttribute("data-theme", saved === "light" ? "light" : "dark");

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

  /* ------------------------------------------------------ youtube facades */
  document.querySelectorAll("[data-yt]").forEach(function (box) {
    var btn = box.querySelector("button");
    if (!btn) { return; }
    btn.addEventListener("click", function () {
      var frame = document.createElement("iframe");
      frame.src = "https://www.youtube-nocookie.com/embed/" + box.getAttribute("data-yt") + "?autoplay=1&rel=0";
      frame.title = box.getAttribute("data-yt-title") || "Video";
      frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture";
      frame.setAttribute("allowfullscreen", "");
      box.textContent = "";
      box.appendChild(frame);
    });
  });

})();
