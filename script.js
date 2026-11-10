(function () {
  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  var header = document.querySelector("header");

  // Mobile nav
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");

  function closeNav() {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menú");
  }

  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  });
  links.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeNav);
  });

  // Header compacto + cerrar el menú móvil desplegable al hacer scroll
  var lastY = window.scrollY;

  window.addEventListener(
    "scroll",
    function () {
      if (header) {
        header.classList.toggle("is-scrolled", window.scrollY > 8);
      }

      if (Math.abs(window.scrollY - lastY) < 8) return; // ignorar micro-movimientos
      lastY = window.scrollY;

      if (links.classList.contains("open")) closeNav();
    },
    { passive: true }
  );

  document.getElementById("year").textContent = new Date().getFullYear();

  // Las listas de servicios, suministros y clientes son ahora HTML estático
  // en index.html (mejor para SEO y accesibilidad). Ver README.

  // ---- Revelado progresivo al hacer scroll ----
  function setupReveal() {
    if (!("IntersectionObserver" in window) || reduceMotion) return;

    var targets = document.querySelectorAll(
      ".section-head, .service-stats, .step, .cliente-card, .cat, .sum-grid li, .edu-list li, #cotForm, .contact-card, .hero-visual"
    );

    var groups = new WeakMap();
    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("reveal-in");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );

    Array.prototype.forEach.call(targets, function (el) {
      var parent = el.parentNode;
      var index = groups.get(parent) || 0;
      groups.set(parent, index + 1);
      el.style.setProperty(
        "--reveal-delay",
        Math.min(index, 5) * 70 + "ms"
      );
      observer.observe(el);
    });
  }

  // ---- Contadores de los indicadores ----
  function setupCounters() {
    var counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;

    var done = new WeakSet();

    function run(el) {
      var target = parseFloat(el.getAttribute("data-count"));
      if (isNaN(target)) return;

      var suffix = el.getAttribute("data-suffix") || "";
      var prefix = el.getAttribute("data-prefix") || "";

      done.add(el);

      if (reduceMotion) {
        el.textContent = prefix + target + suffix;
        return;
      }

      var duration = 1100;
      var started = null;

      function frame(timestamp) {
        if (started === null) started = timestamp;
        var progress = Math.min((timestamp - started) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = prefix + Math.round(target * eased) + suffix;
        if (progress < 1) window.requestAnimationFrame(frame);
      }

      window.requestAnimationFrame(frame);
    }

    if (!("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(counters, run);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          run(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );

    Array.prototype.forEach.call(counters, function (el) {
      if (reduceMotion) return; // dejamos el valor final ya escrito en el HTML
      el.textContent =
        (el.getAttribute("data-prefix") || "") +
        "0" +
        (el.getAttribute("data-suffix") || "");
      observer.observe(el);
    });

    // Red de seguridad: si el observador no llega a dispararse,
    // los indicadores muestran su valor final en lugar de un cero.
    window.setTimeout(function () {
      Array.prototype.forEach.call(counters, function (el) {
        if (done.has(el)) return;
        done.add(el);
        el.textContent =
          (el.getAttribute("data-prefix") || "") +
          el.getAttribute("data-count") +
          (el.getAttribute("data-suffix") || "");
      });
    }, 2500);
  }

  // ---- Menú: sección visible actual ----
  function setupScrollSpy() {
    if (!("IntersectionObserver" in window)) return;

    var navLinks = document.querySelectorAll(
      '.nav-links a[href^="#"]:not(.nav-cta)'
    );
    if (!navLinks.length) return;

    var sections = new Map();

    Array.prototype.forEach.call(navLinks, function (link) {
      var section = document.getElementById(link.getAttribute("href").slice(1));
      if (section) sections.set(section, link);
    });

    if (!sections.size) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var current = sections.get(entry.target);

          Array.prototype.forEach.call(navLinks, function (link) {
            link.classList.remove("is-current");
            link.removeAttribute("aria-current");
          });

          if (current) {
            current.classList.add("is-current");
            current.setAttribute("aria-current", "true");
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );

    sections.forEach(function (_link, section) {
      observer.observe(section);
    });
  }

  // ---- Tarjetas de servicio → cotización precargada ----
  var servicioSelect = document.getElementById("f-servicio");

  function normalize(text) {
    var value = String(text);
    if (value.normalize) {
      value = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function preselectService(name) {
    if (!servicioSelect) return;

    var wanted = normalize(name);
    var match = null;

    Array.prototype.forEach.call(servicioSelect.options, function (option) {
      if (match) return;
      if (normalize(option.value).indexOf(wanted) > -1) match = option;
    });

    if (match) servicioSelect.value = match.value;
  }

  var pulseTimer = null;

  function requestService(name) {
    var form = document.getElementById("cotForm");
    var section = document.getElementById("cotizacion");

    preselectService(name);

    if (section) {
      section.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
    }

    if (!form) return;

    if (pulseTimer) window.clearTimeout(pulseTimer);
    form.classList.remove("is-prompted");
    void form.offsetWidth;
    form.classList.add("is-prompted");
    pulseTimer = window.setTimeout(function () {
      form.classList.remove("is-prompted");
      pulseTimer = null;
    }, 2000);
  }

  function setupServiceCards() {
    Array.prototype.forEach.call(document.querySelectorAll(".cat"), function (card) {
      var title = card.querySelector("h3");
      var name = title ? title.textContent.trim() : "";
      if (!name) return;

      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-label", "Solicitar " + name);

      card.addEventListener("click", function () {
        requestService(name);
      });

      card.addEventListener("keydown", function (event) {
        if (event.key !== "Enter" && event.key !== " " && event.key !== "Spacebar") {
          return;
        }
        event.preventDefault();
        requestService(name);
      });
    });

    // Botones "Solicitar" / "Consultar" de las fichas de servicios activos:
    // bajan al formulario con el servicio ya seleccionado.
    Array.prototype.forEach.call(
      document.querySelectorAll(".active-service-card"),
      function (card) {
        var title = card.querySelector("h3");
        var button = card.querySelector('.ticket-foot a[href^="#cotizacion"]');
        if (!title || !button) return;

        var name = title.textContent.trim();

        button.addEventListener("click", function (event) {
          event.preventDefault();
          requestService(name);
        });
      }
    );
  }

  setupReveal();
  setupCounters();
  setupScrollSpy();
  setupServiceCards();

  // ---- Formulario → WhatsApp ----
  var form = document.getElementById("cotForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var nombre = document.getElementById("f-nombre").value.trim();
    var telefono = document.getElementById("f-telefono").value.trim();
    var servicio = document.getElementById("f-servicio").value;
    var descripcion = document.getElementById("f-descripcion").value.trim();

    var mensaje =
      "Hola Servioficios, quiero solicitar una cotización." +
      "\nNombre: " +
      nombre +
      "\nTeléfono: " +
      telefono +
      "\nServicio de interés: " +
      servicio +
      (descripcion ? "\nDetalle: " + descripcion : "");

    // El enlace corto wa.me/message no admite texto precargado, por eso el
    // formulario usa el número directo (mismo WhatsApp) con el mensaje.
    var url = "https://wa.me/573122850226?text=" + encodeURIComponent(mensaje);
    window.open(url, "_blank", "noopener");
  });
})();
