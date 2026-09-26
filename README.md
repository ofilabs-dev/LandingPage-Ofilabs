# Servioficios y Suministros S.A.S. — Sitio web

Landing page corporativa de **Servioficios y Suministros S.A.S.**, empresa que conecta hogares y negocios de Sincelejo (Sucre, Colombia) y la región con técnicos identificados y evaluados.

El sitio presenta las **12 líneas de servicio**, las **12 categorías de suministros**, la oferta de **formación y capacitación**, y un **formulario de cotización** que arma el mensaje y lo abre directamente en WhatsApp.

## Tecnologías

Sitio estático, sin dependencias ni paso de compilación:

- **HTML5** — `index.html`
- **CSS3** (variables CSS, Grid y Flexbox, responsive) — `styles.css`
- **JavaScript vanilla** (IIFE, sin librerías) — `script.js`
- **Google Fonts** — Fraunces (títulos) y Work Sans (texto)
- **Iconografía** — SVG inline, sin fuente de íconos externa

## Estructura del proyecto

```
.
├── index.html              # Página única: header, hero, servicios, suministros,
│                           # educación, cotización, footer y botón flotante
├── styles.css              # Todos los estilos y la paleta de marca
├── script.js               # Menú móvil y formulario → WhatsApp
├── assets/
│   ├── logo-principal.png  # Logotipo (también usado como favicon)
│   └── logo-slogan.png     # Logo con slogan (pie de página)
├── .gitignore
└── README.md
```

## Cómo verlo localmente

No requiere instalación. Tienes dos opciones:

**1. Abrir el archivo directamente**

Haz doble clic en `index.html`, o arrástralo a tu navegador.

**2. Levantar un servidor local** (recomendado, reproduce las condiciones reales de publicación)

```bash
# Con Python 3 (ya viene instalado en la mayoría de sistemas)
python -m http.server 8000

# O con Node.js
npx serve .
```

Luego abre <http://localhost:8000> en el navegador.

> Cualquiera de las dos opciones funciona igual porque todos los archivos usan rutas relativas (`assets/…`, `styles.css`, `script.js`), lo que permite publicarlo también en un subdirectorio.

## Cómo localizarlo / personalizarlo

| Qué quieres cambiar | Dónde |
| --- | --- |
| Las 12 líneas de servicio y su estado (*Disponible ahora* / *Sujeto a cotización*) | `index.html`, sección `#servicios` (`#catGrid`) |
| Las 12 categorías de suministros | `index.html`, sección `#suministros` (`#sumGrid`) |
| Los clientes / experiencia | `index.html`, sección `#clientes` (`#clientesGrid`) |
| Textos de las secciones (hero, cómo funciona, educación) | `index.html` |
| Colores, tipografías y espaciados | `styles.css`, bloque `:root` |
| Datos de contacto, dirección y datos legales | `index.html` (sección `#cotizacion` y `<footer>`) |
| Número de WhatsApp | `index.html` (enlaces `wa.me`) **y** `script.js` (variable del formulario) — cámbialo en ambos lugares |

## Publicación

Al ser un sitio estático, se puede publicar sin configuración adicional en **GitHub Pages** (rama `main`, carpeta raíz), Netlify, Vercel o cualquier hosting de archivos estáticos.

## Datos de la empresa

- **Razón social:** Servioficios y Suministros S.A.S. — OFILABS S.A.S.
- **NIT:** 901.021.615-8 · Matrícula No. 94175 (Cámara de Comercio de Sincelejo)
- **Dirección:** CL 27 15A 07, Barrio Santa Fe, Sincelejo, Sucre, Colombia
- **WhatsApp / Celular:** [+57 320 759 2276](https://wa.me/573207592276)
- **Teléfono fijo:** (605) 271 5053
- **Correo:** servioficiosysuministros@gmail.com
