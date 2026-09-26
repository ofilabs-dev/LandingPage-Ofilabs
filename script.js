(function () {
  // Mobile nav
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  });
  links.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menú");
    });
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  // Las listas de servicios, suministros y clientes son ahora HTML estático
  // en index.html (mejor para SEO y accesibilidad). Ver README.

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

    var url = "https://wa.me/573207592276?text=" + encodeURIComponent(mensaje);
    window.open(url, "_blank", "noopener");
  });
})();
