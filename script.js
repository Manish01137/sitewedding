/* ============================================================= */
/*  George & Pooja — Wedding Website                              */
/* ============================================================= */
(function () {
  "use strict";

  /* ----------------------------------------------------------- */
  /*  0. ENTRY GATE — tap the cat's nose to enter                 */
  /* ----------------------------------------------------------- */
  var gate = document.getElementById("gate");
  var noseBtn = document.getElementById("noseBtn");
  var gateCat = document.getElementById("gateCat");
  var site = document.getElementById("site");
  var hintTimer;

  /* ----------------------------------------------------------- */
  /*  Self-scaling wedding timeline (fits any column width)        */
  /* ----------------------------------------------------------- */
  var DESIGN_W = 360, DESIGN_H = 540;
  function fitTimeline() {
    var t = document.querySelector(".timeline");
    var inner = document.querySelector(".timeline__inner");
    if (!t || !inner) return;
    var scale = Math.min(1, t.clientWidth / DESIGN_W);
    inner.style.transform = "scale(" + scale + ")";
    t.style.height = (DESIGN_H * scale) + "px";
  }
  window.addEventListener("resize", fitTimeline);
  window.addEventListener("load", fitTimeline);
  fitTimeline();

  /* ----------------------------------------------------------- */
  /*  Subtle parallax drift on the Goa collage background          */
  /* ----------------------------------------------------------- */
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var pageBg = document.querySelector(".page-bg");
  if (pageBg && !reduceMotion) {
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        pageBg.style.backgroundPositionY = (window.scrollY * 0.12).toFixed(1) + "px";
        ticking = false;
      });
    }, { passive: true });
  }

  // Heart + sparkle burst from the cat's nose
  function noseBurst() {
    var wrap = document.querySelector(".gate__catwrap");
    if (!wrap) return;
    var nr = noseBtn.getBoundingClientRect();
    var wr = wrap.getBoundingClientRect();
    var cx = nr.left - wr.left + nr.width / 2;
    var cy = nr.top - wr.top + nr.height / 2;
    var chars = ["♥", "✦", "♥", "✧", "✵"];
    for (var i = 0; i < 18; i++) {
      var p = document.createElement("span");
      p.className = "gate-particle";
      p.textContent = chars[i % chars.length];
      var ang = (Math.PI * 2) * (i / 18) + (Math.random() * 0.5 - 0.25);
      var dist = 64 + Math.random() * 78;
      p.style.left = cx + "px";
      p.style.top = cy + "px";
      p.style.setProperty("--dx", (Math.cos(ang) * dist).toFixed(1) + "px");
      p.style.setProperty("--dy", (Math.sin(ang) * dist).toFixed(1) + "px");
      p.style.setProperty("--r", (Math.random() * 140 - 70).toFixed(0) + "deg");
      p.style.fontSize = (12 + Math.random() * 10).toFixed(0) + "px";
      p.style.animationDelay = (Math.random() * 70).toFixed(0) + "ms";
      wrap.appendChild(p);
    }
    window.setTimeout(function () {
      var ps = wrap.querySelectorAll(".gate-particle");
      for (var j = 0; j < ps.length; j++) ps[j].remove();
    }, 1300);
  }

  function unlock() {
    if (gate.classList.contains("is-open")) return;
    clearTimeout(hintTimer);
    gate.classList.remove("is-hinting");

    // Premium celebration: ring pulse + heart burst + cat wink
    gate.classList.add("is-unlocking");
    gateCat.classList.add("is-wink");
    noseBurst();

    window.setTimeout(function () {
      gate.classList.add("is-open");
      document.body.classList.remove("locked");
      site.setAttribute("aria-hidden", "false");
      site.classList.add("site--in");

      // Reveal the first section right away
      revealVisible();
      fitTimeline();

      // Remove the gate from the flow once the transition finishes
      window.setTimeout(function () {
        gate.style.display = "none";
      }, 1100);
    }, 700);
  }

  noseBtn.addEventListener("click", unlock);
  // Keyboard: the hotspot is a <button>, so Enter/Space already fire click.

  // Show a gentle hint if the guest hasn't tapped after ~3s
  hintTimer = window.setTimeout(function () {
    gate.classList.add("is-hinting");
  }, 3000);

  // Dev/preview shortcut: ?preview=1 opens the site immediately (for screenshots)
  var PREVIEW = /[?&]preview=1/.test(location.search);
  if (PREVIEW) {
    gate.style.display = "none";
    document.body.classList.remove("locked");
    site.setAttribute("aria-hidden", "false");
    document.querySelectorAll('img[loading="lazy"]').forEach(function (im) { im.loading = "eager"; });
    fitTimeline();
    var ym = location.search.match(/[?&]y=(\d+)/);
    if (ym) { window.addEventListener("load", function () { window.scrollTo(0, parseInt(ym[1], 10)); }); }
  }

  // Focus the nose button so keyboard users can act immediately
  window.addEventListener("load", function () {
    try { noseBtn.focus({ preventScroll: true }); } catch (e) { noseBtn.focus(); }
  });

  /* ----------------------------------------------------------- */
  /*  Smooth-scroll for in-page CTAs (e.g. Confirm attendance)    */
  /* ----------------------------------------------------------- */
  document.querySelectorAll('[data-scroll]').forEach(function (el) {
    el.addEventListener("click", function (e) {
      var id = el.getAttribute("data-scroll");
      var target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* ----------------------------------------------------------- */
  /*  Premium scroll-reveal — each piece eases up as it enters     */
  /* ----------------------------------------------------------- */
  // Tag content for the cascade. Decorations fade only (their transforms stay).
  var contentSel = [
    ".sec__pad > *:not(.deco):not(.timeline)",
    ".sec--cover > *:not(.deco):not(.checker-strip)",
    ".cover__namerow > *:not(.deco)",
    ".closing__panel > *:not(.deco)",
    ".gift__content > *",
    ".timeline",
    ".curtain-photo",
    ".polaroid"
  ].join(",");

  document.querySelectorAll(contentSel).forEach(function (el) {
    if (!el.classList.contains("rv")) el.classList.add("rv");
  });
  document.querySelectorAll(".deco").forEach(function (el) { el.classList.add("rvd"); });

  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".rv, .rvd"));

  // Give siblings a gentle stagger so each section cascades in.
  revealEls.forEach(function (el) {
    var sibs = Array.prototype.slice.call(el.parentNode.children).filter(function (c) {
      return c.classList && (c.classList.contains("rv") || c.classList.contains("rvd"));
    });
    var idx = sibs.indexOf(el);
    el.style.setProperty("--rv-delay", Math.min(idx, 6) * 70 + "ms");
  });

  var io = null;
  function show(el) { el.classList.add("in"); }

  if ("IntersectionObserver" in window) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          show(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(show);
  }

  // Preview mode: reveal everything immediately (no per-element initial state)
  if (PREVIEW) {
    revealEls.forEach(function (el) { el.style.setProperty("--rv-delay", "0ms"); show(el); });
  }

  function revealVisible() {
    // Make sure anything already in view shows up immediately after unlock
    revealEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.95) { show(el); }
    });
  }

  /* ----------------------------------------------------------- */
  /*  9. RSVP FORM — collected via the couple's Google Form        */
  /* ----------------------------------------------------------- */
  var RSVP_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScR6OkuWN8bRwki3-NhoUS9tMou-AbQmkaTSvfYA_mA7aF-KA/viewform";
  var form = document.getElementById("rsvpForm");
  var status = document.getElementById("rsvpStatus");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    // RSVPs are collected in the couple's Google Form — open it for the guest.
    window.open(RSVP_FORM_URL, "_blank", "noopener");
    status.style.color = "";
    status.textContent = "Opening our RSVP form… 💌";
  });
})();
